package com.example.QuestWork.domain.manager.service;

import com.example.QuestWork.domain.manager.dto.ManagerProfileResponseDto;
import com.example.QuestWork.domain.manager.dto.ManagerUpdateRequestDto;
import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.manager.repositroy.ManagerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ManagerProfileService {
    private final ManagerProfileRepository managerProfileRepository;

    // 1. 조회 (이미 잘 바꾸셨어요!)
    @Transactional(readOnly = true)
    public ManagerProfileResponseDto getManagerProfile(Long userId) {
        ManagerProfileEntity profile = managerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("매니저 프로필을 찾을 수 없습니다."));
        return ManagerProfileResponseDto.from(profile);
    }

    // 2. 수정 (여기도 userId로 변경!)
    public void updateManagerProfile(Long userId, ManagerUpdateRequestDto dto) {
        // findByUserUsername 대신 findByUserId 사용
        ManagerProfileEntity profile = managerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("수정할 매니저 프로필이 없습니다."));

        if (dto.getNickname() != null) {
            profile.getUser().setNickname(dto.getNickname());
        }

        profile.updateManagerInfo(
                dto.getManagerName(),
                dto.getCompanyName(),
                dto.getContactPhone(),
                dto.getBusinessNumber()
        );
    }
}
