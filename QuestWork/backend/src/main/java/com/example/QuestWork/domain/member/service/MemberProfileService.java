package com.example.QuestWork.domain.member.service;

import com.example.QuestWork.domain.member.dto.MemberProfileDto;


import com.example.QuestWork.domain.member.dto.MemberUpdateDto;
import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberProfileService {

    private final MemberProfileRepository memberProfileRepository;
    private final UserRepository userRepository; // 👈 추가 필요

    /**
     * 1. 마이페이지 프로필 조회 (단순 조회용)
     */
    @Transactional(readOnly = true)
    public MemberProfileDto getProfileByUsername(String username) {
        // [검증] 주소창의 username으로 유저가 존재하는지 확인
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 유저를 찾을 수 없습니다."));

        // [조회] 해당 유저의 프로필 엔티티 가져오기
        MemberProfileEntity profile = memberProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "프로필 정보를 찾을 수 없습니다."));

        return MemberProfileDto.builder()
                .username(user.getUsername())
                .nickname(user.getNickname())
                .profileImageUrl(user.getProfile_image_url())
                .intro(profile.getIntro())
                .level(profile.getLevel() != null ? profile.getLevel().name() : null)
                .portfolioUrl(profile.getPortfolioUrl())
                .totalReward(profile.getTotalReward())
                .totalCareerYears(profile.getTotalCareerYears())
                .badgeCount(profile.getBadgeCount())
                .techStack(profile.getSkillTags() == null ? java.util.Collections.emptyList() :
                        profile.getSkillTags().stream()
                                .map(mst -> mst.getSkillTag().getName())
                                .collect(Collectors.toList()))
                .build();
    }

    /**
     * 2. 마이페이지 프로필 수정 (닉네임 중복 검증 포함)
     */
    @Transactional
    public void updateProfileByUsername(String username, MemberUpdateDto dto) {
        // [검증 1] 수정하려는 대상 유저가 존재하는지 확인
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "수정할 유저를 찾을 수 없습니다."));

        // [검증 2] 닉네임 변경 시 중복 체크
        if (dto.getNickname() != null && !dto.getNickname().equals(user.getNickname())) {
            if (userRepository.existsByNickname(dto.getNickname())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 사용 중인 닉네임입니다.");
            }
            user.setNickname(dto.getNickname());
        }

        // [수정] 프로필 엔티티 찾아서 업데이트
        MemberProfileEntity profile = memberProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "프로필 정보를 찾을 수 없습니다."));

        profile.updateProfile(
                dto.getIntro(),
                dto.getLevel(),
                dto.getPortfolioUrl(),
                dto.getTotalCareerYears()
        );
    }
    }