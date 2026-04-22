package com.example.QuestWork.domain.manager.entity;

import com.example.QuestWork.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "manager_profiles")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class ManagerProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "manager_type", nullable = false, length = 20)
    private String managerType; // COMPANY, INDIVIDUAL

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Column(name = "business_number", length = 50)
    private String businessNumber;

    @Column(name = "manager_name", length = 50)
    private String managerName; // 💡 추가됨

    @Column(name = "contact_phone", length = 30)
    private String contact_phone; // 💡 추가됨

    @Builder.Default
    @Column(nullable = false)
    private boolean approved = false;

    public void updateManagerInfo(String managerName, String companyName, String contactPhone, String businessNumber) {
        // 값이 존재할 때만 업데이트하도록 방어 로직을 추가하면 더 안전합니다.
        if (managerName != null && !managerName.trim().isEmpty()) {
            this.managerName = managerName;
        }
        if (companyName != null && !companyName.trim().isEmpty()) {
            this.companyName = companyName;
        }
        if (contactPhone != null && !contactPhone.trim().isEmpty()) {
            this.contact_phone = contactPhone; // DB 필드명에 맞춰 대입
        }
        if (businessNumber != null && !businessNumber.trim().isEmpty()) {
            this.businessNumber = businessNumber;
        }
    }
}