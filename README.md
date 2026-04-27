# 🚀 QuestWork

> **기존의 프리랜서 플랫폼이 단순히 '사람과 사람을 연결'하는 것에 그쳤다면, QuestWork는 그 이후의 과업 수행과 신뢰할 수 있는 보상에 집중합니다.

**우리는 게임의 '퀘스트' 구조를 비즈니스에 이식하여, 발주자에게는 효율적인 프로젝트 관리를, 수행자에게는 명확한 보상 체계를 제공합니다. 특히 에스크로(Escrow) 기반의 자동 정산 시스템을 통해 거래의 완결성을 확보하고 서비스 신뢰도를 극대화했습니다.**

---

### 🛠 Tech Stack & Auth
| Category | Tech Stack                                         |
| :--- |:---------------------------------------------------|
| **Backend** | Java 17, Spring Boot 3.2.12, Spring Security, JPA |
| **Frontend** | React, Next.js, Tailwind CSS |
| **Database** | MySQL |
| **Social Auth** | Google, Kakao, Naver |
| **IDE & Editors** | IntelliJ IDEA, VS Code, Cursor |
| **Design & Docs** | Figma, Notion, Google Docs |
| **AI Assistance** | ChatGPT, Google Gemini, Codex, v0 |
 | 

---

### ✨ Key Features
 🎯 퀘스트 관리 시스템: 매니저의 과업 등록부터 수행자의 결과물 제출 및 검수까지 이어지는 엔드투엔드 태스크 워크플로우 구현

 🔒 에스크로 기반 자동 정산: 거래 신뢰성 확보를 위한 대금 예치 시스템 및 우승자 선정 시 Point 자동 트랜잭션 처리

 🔑 RBAC 기반 권한 제어: Spring Security를 활용하여 Admin(운영), Manager(발주), Member(수행) 간의 정교한 접근 권한 분리

 ☁️ OAuth 2.0 소셜 인증: Google, Kakao, Naver API 연동을 통한 사용자 접근성 극대화 및 보안성 높은 통합 인증 제공

---

### 📂 Directory Structure
```text
frontend/
├── app/                          # 페이지 라우팅 (Next.js App Router)
│   ├── layout.tsx / page.tsx     # 루트 레이아웃 & 메인 랜딩
│   ├── providers.tsx
│   ├── admin/                    # 관리자
│   │   ├── quest-management/
│   │   ├── settlement-management/
│   │   └── statistics/
│   ├── dashboard/                # 멤버 대시보드
│   │   ├── blog-management/
│   │   ├── earnings/
│   │   ├── my-quests/
│   │   ├── my-submissions/
│   │   └── submissions/
│   ├── manager/                  # 매니저 워크스페이스
│   │   ├── create-quest/
│   │   ├── posted-quests/
│   │   ├── quests/[id]/
│   │   ├── reward-management/
│   │   ├── submission-review/
│   │   └── upgrade/
│   ├── quests/                   # 퀘스트 목록/상세
│   │   ├── [id]/
│   │   ├── web-development/
│   │   ├── mobile-development/
│   │   └── ...
│   ├── blog/ [slug]/
│   ├── profile/ [username]/
│   ├── login/ / signup/
│   └── why-questwork/ / enterprise/
│
├── components/                   # 재사용 컴포넌트
│   ├── global-nav.tsx
│   ├── admin/                    # 관리자 컴포넌트
│   ├── dashboard/                # 대시보드 컴포넌트
│   ├── landing/                  # 랜딩 페이지 섹션
│   ├── manager/                  # 매니저 컴포넌트
│   │   └── use-manager-dashboard-data.ts  # 데이터 훅
│   ├── quest-detail/             # 퀘스트 상세
│   ├── quests/                   # 퀘스트 목록
│   └── ui/                       # shadcn/ui 기본 컴포넌트 (40+)
│
├── lib/                          # 유틸리티
│   ├── api-client.ts             # fetch 공통 클라이언트
│   ├── skill-tags.ts             # 기술스택 목록 (카테고리별)
│   ├── quests.ts / applied-quests.ts
│   └── utils.ts
│
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
│
└── public/                       # 정적 파일 (로고, 이미지, 영상)

backend/src/main/java/com/example/QuestWork/
│
├── domain/                       # 도메인별 비즈니스 로직
│   ├── admin/                    # 관리자 통계/정산
│   │   ├── controller/           # AdminStatsController, AdminWalletController
│   │   ├── dto/                  # AdminStatsResponse, DailyRevenueDto
│   │   └── service/              # AdminStatsService
│   ├── quest/                    # 퀘스트 핵심 도메인
│   │   ├── constant/             # QuestStatus, SubmissionStatus
│   │   ├── controller/           # ManagerQuestController, QuestApplicationController, QuestController
│   │   ├── dto/                  # 각종 Request/Response DTO
│   │   ├── entity/               # Quest, QuestApplication, QuestSubmission, QuestWinner
│   │   ├── repository/
│   │   └── service/              # ManagerQuestService, QuestApplicationService, QuestService
│   ├── user/                     # 사용자 계정
│   │   ├── controller/ / dto/ / entity/ / repository/ / service/
│   │   └── constant/
│   ├── member/                   # 멤버 프로필 (프리랜서)
│   │   ├── controller/ / dto/ / entity/ / repository/ / service/
│   │   └── constant/             # MemberLevel
│   ├── manager/                  # 매니저 프로필
│   │   ├── controller/ / dto/ / entity/ / service/
│   │   └── repositroy/          
│   ├── payment/                  # 결제/수수료
│   │   ├── entity/               # Payment
│   │   ├── repository/           # PaymentRepository
│   │   └── service/              # PaymentService
│   ├── wallet/                   # 지갑/정산
│   │   ├── controller/           # WalletController (/api/settlement/*)
│   │   ├── dto/ / entity/ / repository/
│   │   └── service/              # WalletService (processSettlement)
│   ├── escrows/                  # 에스크로 (보증금)
│   │   ├── entity/ / repository/
│   ├── withdraw/                 # 출금 신청
│   │   ├── constant/             # WithdrawStatus
│   │   ├── dto/ / entity/ / repository/
│   ├── auth/                     # 인증 (OAuth2)
│   ├── skill/                    # 기술 스킬 태그
│   │   ├── entity/ / repository/
│   └── role/                     # 역할 (MEMBER/MANAGER/ADMIN)
│       ├── constant/ / entity/ / repository/
│
├── global/                       # 공통 설정
│   ├── SecurityConfig.java
│   ├── OAuth2SuccessHandler.java
│   └── config.java
│
└── resources/
└── application.properties

🖼️ Database Entire ERD
![ERD](./images/diagram.png)
*이미지를 클릭하면 원본 크기로 상세히 볼 수 있습니다.*

