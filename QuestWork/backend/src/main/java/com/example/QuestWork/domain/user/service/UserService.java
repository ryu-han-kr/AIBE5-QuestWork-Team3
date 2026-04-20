package com.example.QuestWork.domain.user.service;

import com.example.QuestWork.domain.manager.entity.ManagerProfileEntity;
import com.example.QuestWork.domain.manager.repositroy.ManagerProfileRepository;
import com.example.QuestWork.domain.member.constant.MemberLevel;
import com.example.QuestWork.domain.member.entity.MemberProfileEntity;
import com.example.QuestWork.domain.member.repository.MemberProfileRepository;
import com.example.QuestWork.domain.user.dto.UserLoginRequestDto;
import com.example.QuestWork.domain.user.dto.UserRequestDto;
import com.example.QuestWork.domain.user.entity.User;
import com.example.QuestWork.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;


@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    // 💡 아래 레포지토리들이 반드시 추가되어야 합니다.
    private final MemberProfileRepository memberProfileRepository;
    private final ManagerProfileRepository managerProfileRepository;

    @Transactional(readOnly=true)
    public String login(UserLoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다"));
        if(!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 틀렸습니다"); }
        return user.getNickname();
    }
    @Transactional
    public void signUp(UserRequestDto dto) {
        // 1. 비밀번호 암호화 및 유저 저장
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        User user = userRepository.save(dto.toUserEntity(encodedPassword));

        // 2. 권한 및 프로필 생성
        String roleType = dto.getRoleType();

        if ("MANAGER".equals(roleType)) {
            userRepository.insertUserRoleNative(user.getId(), "MANAGER");

            ManagerProfileEntity managerProfile = ManagerProfileEntity.builder()
                    .user(user)
                    .managerType(dto.getManagerType())
                    .companyName(dto.getCompanyName())
                    .businessNumber(dto.getBusinessNumber())
                    .approved(false)
                    .build();
            managerProfileRepository.save(managerProfile);

        } else {
            userRepository.insertUserRoleNative(user.getId(), "MEMBER");

            MemberProfileEntity memberProfile = MemberProfileEntity.builder()
                    .user(user)
                    .level(MemberLevel.BRONZE)
                    .badgeCount(0)
                    .totalReward(BigDecimal.ZERO)
                    .build();
            memberProfileRepository.save(memberProfile);
        }
    }
    }




