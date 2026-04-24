package com.example.QuestWork.domain.payment.repository;


import com.example.QuestWork.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByQuestIdAndMemberId(Long questId, Long memberId);

    // PaymentRepository.java
    @Query("SELECT SUM(p.fee) FROM Payment p WHERE DATE(p.paidAt) = CURRENT_DATE")
    BigDecimal calculateTodayFee();

    @Query("SELECT SUM(p.fee) FROM Payment p")
    BigDecimal sumAllFees();
}