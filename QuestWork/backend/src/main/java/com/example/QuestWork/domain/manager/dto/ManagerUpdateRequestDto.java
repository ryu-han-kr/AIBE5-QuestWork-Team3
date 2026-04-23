package com.example.QuestWork.domain.manager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ManagerUpdateRequestDto {
    private String nickname;       // 유저 테이블의 닉네임도 같이 수정하기 위함
    private String managerName;    // 담당자 성함
    private String companyName;    // 회사명
    private String contactPhone;   // 연락처
    private String businessNumber; // 사업자 번호
}