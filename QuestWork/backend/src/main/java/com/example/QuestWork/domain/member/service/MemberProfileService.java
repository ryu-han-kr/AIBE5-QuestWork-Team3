package com.example.QuestWork.domain.member.service;

import com.example.QuestWork.domain.member.dto.MemberProfileDto;


import com.example.QuestWork.domain.member.dto.MemberUpdateDto;
import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.entity.MemberSkillTagEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.member.repository.MemberSkillTagRepository;
import com.example.QuestWork.domain.member.repository.SkillTagRepository;
import com.example.QuestWork.domain.skill.SkillTagEntity;
import com.example.QuestWork.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberProfileService {

    private final MemberProfileRepository memberProfileRepository;
    private final SkillTagRepository skillTagRepository;
    private final MemberSkillTagRepository memberSkillTagRepository;

    // 💡 String username -> Long userId로 변경
    public MemberProfileDto getProfile(Long userId) {
        // findByUserId 사용
        MemberProfileEntity profile = memberProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("해당 ID의 프로필을 찾을 수 없습니다: " + userId));

        return MemberProfileDto.builder()
                .username(profile.getUser().getUsername())
                .nickname(profile.getUser().getNickname())
                .profileImageUrl(profile.getUser().getProfile_image_url())
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

    @Transactional
    public void updateProfile(Long userId, MemberUpdateDto dto) { // 💡 매개변수 타입 변경
        MemberProfileEntity profile = memberProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("프로필을 찾을 수 없습니다. ID: " + userId));

        User user = profile.getUser();
        if (dto.getNickname() != null) {
            user.setNickname(dto.getNickname());
        }

        profile.updateProfile(
                dto.getIntro(),
                dto.getLevel(),
                dto.getPortfolioUrl(),
                dto.getTotalCareerYears()
        );
    }

    @Transactional
    public void addSkill(Long memberId, Long skillTagId) {
        // 1. memberId를 가지고 DB에서 회원(MemberProfileEntity)을 찾아옵니다.
        // 회원이 없으면 에러를 뱉도록 처리합니다.
        MemberProfileEntity member = memberProfileRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("해당 회원을 찾을 수 없습니다."));

        // 2. skillTagId를 가지고 DB에서 기술(SkillTagEntity)을 찾아옵니다.
        SkillTagEntity skillTag = skillTagRepository.findById(skillTagId)
                .orElseThrow(() -> new IllegalArgumentException("해당 기술 스택을 찾을 수 없습니다."));

        // 3. 찾은 '회원'과 '기술'을 새로운 연결 상자(MemberSkillTagEntity)에 담아 묶어줍니다.
        MemberSkillTagEntity memberSkillTag = new MemberSkillTagEntity();
        memberSkillTag.setMemberProfile(member); // 백엔드 엔티티 구조에 따라 setter 이름이 다를 수 있습니다.
        memberSkillTag.setSkillTag(skillTag);

        // 4. 레포지토리를 사용해 DB에 최종적으로 저장합니다.
        memberSkillTagRepository.save(memberSkillTag);
    }

    public java.util.List<SkillTagEntity> getAllSkillTags() {
        return skillTagRepository.findAll();
    }

}