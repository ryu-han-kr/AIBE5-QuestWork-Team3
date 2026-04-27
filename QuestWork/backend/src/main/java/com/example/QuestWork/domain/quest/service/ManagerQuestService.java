package com.example.QuestWork.domain.quest.service;

import com.example.QuestWork.domain.escrows.entity.Escrow;
import com.example.QuestWork.domain.escrows.repository.EscrowRepository;
import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.manager.repositroy.ManagerProfileRepository;
import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.payment.entity.Payment;
import com.example.QuestWork.domain.payment.repository.PaymentRepository;
import com.example.QuestWork.domain.quest.dto.*;
import com.example.QuestWork.domain.quest.entity.Quest;
import com.example.QuestWork.domain.quest.entity.QuestSubmission;
import com.example.QuestWork.domain.quest.entity.QuestWinner;
import com.example.QuestWork.domain.quest.constant.QuestStatus;
import com.example.QuestWork.domain.quest.repository.QuestApplicationRepository;
import com.example.QuestWork.domain.quest.repository.QuestRepository;
import com.example.QuestWork.domain.quest.repository.QuestSubmissionRepository;
import com.example.QuestWork.domain.quest.repository.QuestWinnerRepository;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import com.example.QuestWork.domain.wallet.entity.WalletEntity;
import com.example.QuestWork.domain.wallet.entity.WalletTransaction;
import com.example.QuestWork.domain.wallet.repository.WalletRepository;
import com.example.QuestWork.domain.wallet.repository.WalletTransactionRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)

public class ManagerQuestService {
    private final QuestRepository questRepository;
    private final QuestApplicationRepository questApplicationRepository;
    private final QuestSubmissionRepository questSubmissionRepository;
    private final QuestWinnerRepository questWinnerRepository;
    private final ManagerProfileRepository managerProfileRepository;
    private final UserRepository userRepository;
    private final EscrowRepository escrowRepository;
    private final MemberProfileRepository memberProfileRepository;
    private final PaymentRepository paymentRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;


    //본인이 등록한 모든 퀘스트 목록 조회
    public List<ManagerQuestResponseDto> getMyQuests(Long userId) {
        ManagerProfileEntity manager = getManagerProfile(userId);

        return questRepository.findAllByManagerId(manager)
                .stream().map(ManagerQuestResponseDto::from).toList();
    }
    //특정 퀘스트에 참여를 신청한 지원자 명단 조회
    public List<QuestApplicantResponseDto> getApplicants(Long questId, Long userId) {
        Quest quest = getQuestAndValidateOwner(questId, userId);

        return questApplicationRepository.findAllByQuest(quest)
                .stream().map(QuestApplicantResponseDto::from).toList();
    }

    //특정 퀘스트에 제출된 최종 결과물(과제) 목록 조회
    public List<QuestSubmissionResponseDto> getSubmissions(Long questId, Long userId) {
        Quest quest = getQuestAndValidateOwner(questId, userId);

        return questSubmissionRepository.findAllByQuest(quest)
                .stream()
                .map(QuestSubmissionResponseDto::from)
                .toList();
    }
    //퀘스트 우승자(최종 선정자) 확정
    @Transactional
    public QuestWinnerResponseDto selectWinner(Long questId, Long userId, SelectWinnerRequestDto requestDto) {
        Quest quest = getQuestAndValidateOwner(questId, userId);

        if (questWinnerRepository.existsByQuest(quest)) {
            throw new IllegalStateException("이미 최종 선정된 퀘스트입니다.");
        }

        QuestSubmission submission = questSubmissionRepository.findById(requestDto.getSubmissionId())
                .orElseThrow(() -> new IllegalArgumentException("제출 결과를 찾을 수 없습니다."));

        if (!submission.getQuest().getId().equals(quest.getId())) {
            throw new IllegalStateException("해당 퀘스트의 제출 결과가 아닙니다.");
        }

        QuestWinner winner = QuestWinner.create(quest, submission);
        QuestWinner savedWinner = questWinnerRepository.save(winner);

        // 제출물 상태를 WINNER로 변경
        submission.markAsWinner();
        questSubmissionRepository.save(submission);
        processSettlement(submission.getMember().getId(), quest.getId(), quest.getRewardAmount());

        // 퀘스트 상태를 PICKED(우승자 선정 완료)로 변경
        quest.updateStatus(QuestStatus.PICKED);
        questRepository.save(quest);

        // 에스크로 생성 (아직 없는 경우만)
        if (!escrowRepository.existsByQuestId(questId)) {
            ManagerProfileEntity manager = getManagerProfile(userId);
            Escrow escrow = Escrow.builder()
                    .questId(questId)
                    .managerId(manager.getId())
                    .amount(quest.getRewardAmount())
                    .status("LOCKED")
                    .depositedAt(LocalDateTime.now())
                    .build();
            escrowRepository.save(escrow);
        }

        return QuestWinnerResponseDto.from(savedWinner);
    }


    @Transactional // <- 이 부분을 반드시 추가하세요! (정합성 보장)
    public void processSettlement(Long memberId, Long questId, BigDecimal totalAmount) {
        // 1. 멤버 프로필 조회 및 실제 유저 ID 추출
        MemberProfileEntity profile = memberProfileRepository.findById(memberId)
                .orElseThrow(() -> new EntityNotFoundException("멤버 프로필 없음 (ID: " + memberId + ")"));

        Long actualUserId = profile.getUser().getId();

        // 2. 수수료(10%) 및 실지급액 계산
        BigDecimal fee = totalAmount.multiply(new BigDecimal("0.1"));
        BigDecimal netAmount = totalAmount.subtract(fee);

        // 3. Payments 저장 (정산 상태를 'PAID'로 명시)
        paymentRepository.save(Payment.builder()
                .memberId(memberId)
                .questId(questId)
                .amount(totalAmount)
                .fee(fee)
                .netAmount(netAmount)
                .status("PAID") // 슬라이드와 동일하게 'PAID' 적용
                .paidAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build());

        // 4. 유저 지갑 업데이트 (실제 유저의 PK인 actualUserId 사용)
        WalletEntity wallet = walletRepository.findByUserId(actualUserId)
                .orElseThrow(() -> new EntityNotFoundException("유저 ID " + actualUserId + "의 지갑을 찾을 수 없습니다."));

        wallet.addBalance(netAmount);

        // 5. 입금 내역 저장
        transactionRepository.save(WalletTransaction.builder()
                .wallet(wallet)
                .userId(actualUserId)
                .amount(netAmount)
                .type("SETTLEMENT")
                .status("COMPLETED")
                .referenceId(questId)
                .description(String.format("퀘스트 #%d 정산 입금 완료", questId))
                .build());
    }

    //맴버가 소유하고 잇는 퀘스트인지 검증
    private Quest getQuestAndValidateOwner(Long questId, Long userId) {
        ManagerProfileEntity manager = getManagerProfile(userId);

        Quest quest = questRepository.findById(questId)
                .orElseThrow(() -> new IllegalArgumentException("퀘스트를 찾을 수 없습니다"));

        if (!quest.getManagerId().getId().equals(manager.getId())) {
            throw new IllegalStateException("본인이 등록한 퀘스트만 관리할 수 있습니다.");
        }
        return quest;
    }
    //매니저 아이디 가져오기 - 없으면 자동 생성

    private ManagerProfileEntity getManagerProfile(Long userId) {
        return managerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다"));
                    ManagerProfileEntity newProfile = ManagerProfileEntity.builder()
                            .user(user)
                            .managerType("INDIVIDUAL")
                            .approved(false)
                            .build();
                    return managerProfileRepository.save(newProfile);
                });
    }
}
