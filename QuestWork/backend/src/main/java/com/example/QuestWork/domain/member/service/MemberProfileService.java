package com.example.QuestWork.domain.member.service;

import com.example.QuestWork.domain.member.dto.MemberProfileDto;


import com.example.QuestWork.domain.member.dto.MemberUpdateDto;
import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
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
}