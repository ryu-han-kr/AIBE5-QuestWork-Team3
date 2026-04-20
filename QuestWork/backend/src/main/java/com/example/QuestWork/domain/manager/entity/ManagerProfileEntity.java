package com.example.QuestWork.domain.manager.entity;

import com.example.QuestWork.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ManagerProfileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @Enumerated(EnumType.STRING)
    private User user;

    private String managerType; // COMPANY, INDIVIDUAL
    private String companyName;
    private String businessNumber;
    private boolean approved;
}