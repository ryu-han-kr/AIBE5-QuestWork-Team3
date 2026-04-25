package com.example.QuestWork.domain.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class DailyRevenueDto {
    private String date;
    private BigDecimal amount;

    // JPA/Hibernate가 데이터를 담을 때 사용하는 수동 생성자
    public DailyRevenueDto(Object date, BigDecimal amount) {
        // DB에서 넘어온 날짜(Object)를 안전하게 문자열(String)로 변환
        this.date = (date != null) ? String.valueOf(date) : "";
        this.amount = (amount != null) ? amount : BigDecimal.ZERO;
    }
}