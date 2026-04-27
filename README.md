# 🚀 QuestWork

> **기존의 프리랜서 플랫폼이 단순히 '사람과 사람을 연결'하는 것에 그쳤다면, QuestWork는 그 이후의 과업 수행과 신뢰할 수 있는 보상에 집중합니다.**

**우리는 게임의 '퀘스트' 구조를 비즈니스에 이식하여, 발주자에게는 효율적인 프로젝트 관리를, 수행자에게는 명확한 보상 체계를 제공합니다. 특히 에스크로(Escrow) 기반의 자동 정산 시스템을 통해 거래의 완결성을 확보하고 서비스 신뢰도를 극대화했습니다.**

---

### 🛠 Tech Stack & Auth

| Category | Tech Stack |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.2.12, Spring Security, JPA |
| **Frontend** | React, Next.js, Tailwind CSS |
| **Database** | MySQL |
| **Social Auth** | Google, Kakao, Naver |
| **IDE & Editors** | IntelliJ IDEA, VS Code, Cursor |
| **Design & Docs** | Figma, Notion, Google Docs |
| **AI Assistance** | ChatGPT, Google Gemini, Codex, v0 |

---

### ✨ Key Features

* 🎯 **퀘스트 관리 시스템**: 매니저의 과업 등록부터 수행자의 결과물 제출 및 검수까지 이어지는 엔드투엔드 태스크 워크플로우 구현
* 🔒 **에스크로 기반 자동 정산**: 거래 신뢰성 확보를 위한 대금 예치 시스템 및 우승자 선정 시 Point 자동 트랜잭션 처리
* 🔑 **RBAC 기반 권한 제어**: Spring Security를 활용하여 Admin(운영), Manager(발주), Member(수행) 간의 정교한 접근 권한 분리
* ☁️ **OAuth 2.0 소셜 인증**: Google, Kakao, Naver API 연동을 통한 사용자 접근성 극대화 및 보안성 높은 통합 인증 제공

---

### 📂 Directory Structure

```text
frontend/
├── app/                          # 페이지 라우팅 (Next.js App Router)
│   ├── layout.tsx / page.tsx     # 루트 레이아웃 & 메인 랜딩
│   ├── admin/                    # 관리자 대시보드 (통계/정산 관리)
│   ├── dashboard/                # 멤버 워크스페이스 (참여 퀘스트/수익)
│   ├── manager/                  # 매니저 워크스페이스 (퀘스트 등록/검수)
│   ├── quests/                   # 퀘스트 목록 및 상세 페이지
│   ├── blog/ / profile/          # 기술 블로그 및 유저 프로필
│   └── login/ / signup/          # 인증 페이지
├── components/                   # 재사용 UI 컴포넌트 (shadcn/ui 기반)
├── lib/                          # API 클라이언트 및 유틸리티
├── hooks/                        # 커스텀 훅 (비즈니스 로직 분리)
└── public/                       # 정적 리소스 (Images, Videos)

backend/src/main/java/com/example/QuestWork/
├── domain/                       # 도메인별 비즈니스 로직
│   ├── admin/                    # 플랫폼 전체 통계 및 관리자 기능
│   ├── quest/                    # 퀘스트 등록, 조회, 상태 관리 핵심 도메인
│   ├── user/                     # 기본 사용자 계정 관리
│   ├── member/                   # 프리랜서(수행자) 프로필 및 레벨
│   ├── manager/                  # 발주자 프로필 및 관리
│   ├── payment/                  # 결제 영수증 및 상태(PAID) 관리
│   ├── wallet/                   # 유저 지갑 및 정산 트랜잭션 처리
│   ├── escrows/                  # 대금 예치 관리
│   ├── withdraw/                 # 출금 신청 프로세스
│   ├── auth/                     # OAuth2 & JWT 인증 로직
│   └── role/                     # RBAC 권한(MEMBER, MANAGER, ADMIN)
├── global/                       # 공통 설정 (Security, Config, Error Handler)
└── resources/                    # application.properties 및 DB 설정
```

---

### 🔑 Core API Specifications

| Category | API Endpoint & Description |
| :--- | :--- |
| **Auth & User** | `POST /api/auth/signup` - 일반 및 소셜 회원가입 |
| | `GET /api/user/{id}` - 유저 프로필 및 활동 정보 조회 |
| | `POST /api/upload` - 파일 및 과업 결과물 업로드 |
| **Quest Management** | `POST /api/quests` - 퀘스트 등록 및 에스크로 예치 |
| | `GET /api/quests` - 전체 퀘스트 목록 및 필터링 조회 |
| | `PATCH /api/quests/{id}/status` - 퀘스트 상태 변경 관리 |
| **Work & Settlement** | `POST /api/quests/{id}/submissions` - 과업 결과물 제출 |
| | **`POST /api/manager/quests/{id}/winner`** - **우승자 선정 및 정산(PAID) 실행** |
| **Wallet & Finance** | `GET /api/settlement/wallet/{userId}` - 실시간 잔액 및 포인트 확인 |
| | `POST /api/settlement/withdraw` - 정산 포인트 출금 신청 |
| | `GET /api/settlement/transactions/{id}` - 상세 거래 내역 히스토리 |
| **Admin System** | `GET /api/admin/stats/summary` - 플랫폼 매출 및 통계 요약 |
| | `POST /api/admin/settle` - 플랫폼 수수료 최종 정산 처리 |
| | `PATCH /api/admin/users/{id}/role` - 사용자 권한 및 상태 관리 |

---

### 🖼️ Database Entire ERD
````
create table roles
(
id   bigint auto_increment
primary key,
name varchar(30) not null comment 'MEMBER, MANAGER, ADMIN',
constraint name
unique (name)
);

create table skill_tags
(
id         bigint auto_increment
primary key,
name       varchar(100) not null,
category   varchar(50)  not null comment 'BACKEND, FRONTEND, DB, INFRA, AI, ETC',
created_at datetime     not null,
constraint name
unique (name)
);

create table users
(
id                bigint auto_increment
primary key,
username          varchar(50)                  not null,
password          varchar(255)                 null,
email             varchar(100)                 not null,
nickname          varchar(50)                  not null,
profile_image_url varchar(255)                 null,
provider          varchar(20)                  not null comment 'LOCAL, KAKAO, GOOGLE',
provider_id       varchar(100)                 null,
status            varchar(20) default 'ACTIVE' not null comment 'ACTIVE, INACTIVE, SUSPENDED',
created_at        datetime                     not null,
updated_at        datetime                     not null,
constraint email
unique (email),
constraint username
unique (username)
);

create table manager_profiles
(
id              bigint auto_increment
primary key,
user_id         bigint               not null,
manager_type    varchar(20)          not null comment 'COMPANY, INDIVIDUAL',
company_name    varchar(100)         null,
business_number varchar(50)          null,
manager_name    varchar(50)          null,
contact_phone   varchar(30)          null,
approved        tinyint(1) default 0 not null,
constraint user_id
unique (user_id),
constraint manager_profiles_ibfk_1
foreign key (user_id) references users (id)
);

create table member_profiles
(
id                 bigint auto_increment
primary key,
user_id            bigint                                                                    not null,
portfolio_url      varchar(255)                                                              null,
intro              text                                                                      null,
level              enum ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND') default 'BRONZE' null,
badge_count        int                                                      default 0        not null,
total_reward       decimal(12, 2)                                           default 0.00     not null,
total_career_years int                                                      default 0        not null,
constraint user_id
unique (user_id),
constraint member_profiles_ibfk_1
foreign key (user_id) references users (id)
);

create table member_profile_skills
(
member_profile_id bigint not null,
skill_tag_id      bigint not null,
constraint FK4sr8aijg948kc5o55lfwps0to
foreign key (member_profile_id) references member_profiles (id),
constraint FKsaboi0cm4j02b6caqp15psrfg
foreign key (skill_tag_id) references skill_tags (id)
);

create table member_skill_tags
(
id                  bigint auto_increment
primary key,
member_id           bigint                         not null,
skill_tag_id        bigint                         not null,
level               varchar(30) default 'BEGINNER' not null comment 'BEGINNER, INTERMEDIATE, ADVANCED',
years_of_experience int         default 0          not null,
constraint member_skill_tags_index_5
unique (member_id, skill_tag_id),
constraint member_skill_tags_ibfk_1
foreign key (member_id) references member_profiles (id),
constraint member_skill_tags_ibfk_2
foreign key (skill_tag_id) references skill_tags (id)
);

create index skill_tag_id
on member_skill_tags (skill_tag_id);

create table notifications
(
id         bigint auto_increment
primary key,
user_id    bigint               not null,
type       varchar(50)          not null comment 'QUEST, PICK, COMMENT, SYSTEM',
title      varchar(200)         not null,
message    text                 not null,
is_read    tinyint(1) default 0 not null,
created_at datetime             not null,
constraint notifications_ibfk_1
foreign key (user_id) references users (id)
);

create index user_id
on notifications (user_id);

create table posts
(
id            bigint auto_increment
primary key,
member_id     bigint               not null,
title         varchar(200)         not null,
content       longtext             not null,
thumbnail_url varchar(255)         null,
view_count    int        default 0 not null,
created_at    datetime             not null,
updated_at    datetime             not null,
deleted       tinyint(1) default 0 not null,
constraint posts_ibfk_1
foreign key (member_id) references member_profiles (id)
);

create table comments
(
id         bigint auto_increment
primary key,
post_id    bigint               not null,
user_id    bigint               not null,
content    text                 not null,
created_at datetime             not null,
updated_at datetime             not null,
deleted    tinyint(1) default 0 not null,
constraint comments_ibfk_1
foreign key (post_id) references posts (id),
constraint comments_ibfk_2
foreign key (user_id) references users (id)
);

create index post_id
on comments (post_id);

create index user_id
on comments (user_id);

create table post_likes
(
id         bigint auto_increment
primary key,
post_id    bigint   not null,
user_id    bigint   not null,
created_at datetime not null,
constraint post_likes_index_2
unique (post_id, user_id),
constraint post_likes_ibfk_1
foreign key (post_id) references posts (id),
constraint post_likes_ibfk_2
foreign key (user_id) references users (id)
);

create index user_id
on post_likes (user_id);

create index member_id
on posts (member_id);

create table project_groups
(
id          bigint auto_increment
primary key,
manager_id  bigint       not null,
name        varchar(100) not null,
description text         null,
created_at  datetime     not null,
constraint project_groups_ibfk_1
foreign key (manager_id) references manager_profiles (id)
);

create table project_group_members
(
id            bigint auto_increment
primary key,
group_id      bigint                       not null,
member_id     bigint                       not null,
joined_at     datetime                     not null,
role_in_group varchar(30) default 'MEMBER' not null,
constraint project_group_members_index_4
unique (group_id, member_id),
constraint project_group_members_ibfk_1
foreign key (group_id) references project_groups (id),
constraint project_group_members_ibfk_2
foreign key (member_id) references member_profiles (id)
);

create index member_id
on project_group_members (member_id);

create index manager_id
on project_groups (manager_id);

create table quests
(
id            bigint auto_increment
primary key,
manager_id    bigint                     not null,
title         varchar(200)               not null,
form_data     json                       not null,
reward_amount decimal(12, 2)             not null,
deadline      datetime                   not null,
status        varchar(30) default 'OPEN' not null comment 'OPEN, IN_PROGRESS, CLOSED, PICKED, CANCELED',
created_at    datetime                   not null,
updated_at    datetime                   not null,
constraint fk_quest_manager
foreign key (manager_id) references manager_profiles (id),
constraint quests_ibfk_1
foreign key (manager_id) references manager_profiles (id),
constraint fk_quests_to_manager_profiles_final
foreign key (manager_id) references manager_profiles (id)
);

create table disputes
(
id             bigint auto_increment
primary key,
quest_id       bigint                          not null,
reporter_id    bigint                          not null,
target_user_id bigint                          null,
title          varchar(200)                    not null,
content        text                            not null,
status         varchar(30) default 'REQUESTED' not null,
resolved_by    bigint                          null,
created_at     datetime                        not null,
resolved_at    datetime                        null,
constraint disputes_ibfk_1
foreign key (quest_id) references quests (id),
constraint disputes_ibfk_2
foreign key (reporter_id) references users (id),
constraint disputes_ibfk_3
foreign key (target_user_id) references users (id),
constraint disputes_ibfk_4
foreign key (resolved_by) references users (id)
);

create index quest_id
on disputes (quest_id);

create index reporter_id
on disputes (reporter_id);

create index resolved_by
on disputes (resolved_by);

create index target_user_id
on disputes (target_user_id);

create table escrows
(
id           bigint auto_increment
primary key,
quest_id     bigint                       not null,
manager_id   bigint                       not null,
amount       decimal(12, 2)               not null,
status       varchar(30) default 'LOCKED' not null comment 'LOCKED, RELEASED, REFUNDED',
deposited_at datetime                     not null,
released_at  datetime                     null,
constraint quest_id
unique (quest_id),
constraint escrows_ibfk_1
foreign key (quest_id) references quests (id),
constraint escrows_ibfk_2
foreign key (manager_id) references manager_profiles (id)
);

create index manager_id
on escrows (manager_id);

create table payments
(
id         bigint auto_increment
primary key,
member_id  bigint                      not null,
quest_id   bigint                      not null,
amount     decimal(38, 2)              null,
fee        decimal(38, 2)              null,
net_amount decimal(38, 2)              null,
status     varchar(30) default 'READY' not null,
paid_at    datetime                    null,
created_at datetime                    not null,
constraint payments_ibfk_1
foreign key (member_id) references member_profiles (id),
constraint payments_ibfk_2
foreign key (quest_id) references quests (id)
);

create index member_id
on payments (member_id);

create index quest_id
on payments (quest_id);

create table quest_applications
(
id         bigint auto_increment
primary key,
quest_id   bigint                        not null,
member_id  bigint                        not null,
applied_at datetime                      not null,
status     varchar(30) default 'APPLIED' not null comment 'APPLIED, CANCELED',
constraint quest_applications_index_1
unique (quest_id, member_id),
constraint uq_quest_application
unique (quest_id, member_id),
constraint quest_applications_ibfk_1
foreign key (quest_id) references quests (id),
constraint quest_applications_ibfk_2
foreign key (member_id) references member_profiles (id),
constraint FK1sn312wtvaqxb84xiivyfyo8d
foreign key (member_id) references users (id)
);

create table quest_skill_tags
(
id             bigint auto_increment
primary key,
quest_id       bigint                         not null,
skill_tag_id   bigint                         not null,
required_level varchar(30) default 'BEGINNER' null comment 'BEGINNER, INTERMEDIATE, ADVANCED',
is_required    tinyint(1)  default 1          not null,
constraint quest_skill_tags_index_6
unique (quest_id, skill_tag_id),
constraint quest_skill_tags_ibfk_1
foreign key (quest_id) references quests (id),
constraint quest_skill_tags_ibfk_2
foreign key (skill_tag_id) references skill_tags (id)
);

create index skill_tag_id
on quest_skill_tags (skill_tag_id);

create table quest_submissions
(
id                 bigint auto_increment
primary key,
quest_id           bigint                          not null,
member_id          bigint                          not null,
submission_title   varchar(200)                    not null,
submission_content tinytext                        null,
file_url           varchar(255)                    null,
repo_url           varchar(255)                    null,
version_no         int         default 1           not null,
submitted_at       datetime                        not null,
status             varchar(30) default 'SUBMITTED' not null comment 'SUBMITTED, UPDATED',
updated_at         datetime(6)                     not null,
constraint quest_submissions_ibfk_1
foreign key (quest_id) references quests (id),
constraint quest_submissions_ibfk_2
foreign key (member_id) references member_profiles (id),
constraint FKnahlkouvnnsulhm5nqyn080au
foreign key (member_id) references users (id)
);

create index quest_id
on quest_submissions (quest_id);

create table quest_winners
(
id               bigint auto_increment
primary key,
quest_id         bigint               not null,
submission_id    bigint               not null,
member_id        bigint               not null,
selected_at      datetime             not null,
reward_confirmed tinyint(1) default 0 not null,
constraint quest_id
unique (quest_id),
constraint quest_winners_ibfk_1
foreign key (quest_id) references quests (id),
constraint quest_winners_ibfk_2
foreign key (submission_id) references quest_submissions (id),
constraint quest_winners_ibfk_3
foreign key (member_id) references member_profiles (id)
);

create index member_id
on quest_winners (member_id);

create index submission_id
on quest_winners (submission_id);

create table series
(
id          bigint auto_increment
primary key,
member_id   bigint       not null,
title       varchar(200) not null,
description text         null,
created_at  datetime     not null,
updated_at  datetime     not null,
constraint series_ibfk_1
foreign key (member_id) references member_profiles (id)
);

create index member_id
on series (member_id);

create table series_posts
(
id        bigint auto_increment
primary key,
series_id bigint        not null,
post_id   bigint        not null,
order_no  int default 1 not null,
constraint series_posts_index_3
unique (series_id, post_id),
constraint series_posts_ibfk_1
foreign key (series_id) references series (id),
constraint series_posts_ibfk_2
foreign key (post_id) references posts (id)
);

create index post_id
on series_posts (post_id);

create table user_roles
(
id        bigint auto_increment
primary key,
user_id   bigint       not null,
role_id   bigint       not null,
role_name varchar(255) null,
constraint user_roles_index_0
unique (user_id, role_id),
constraint user_roles_ibfk_1
foreign key (user_id) references users (id),
constraint user_roles_ibfk_2
foreign key (role_id) references roles (id)
);

create index role_id
on user_roles (role_id);

create table wallet
(
id      bigint auto_increment
primary key,
user_id bigint         not null,
balance decimal(12, 2) not null,
version bigint         null,
constraint user_id
unique (user_id)
);

create table wallet_entity
(
id      bigint auto_increment
primary key,
balance bigint not null,
user_id bigint not null,
version bigint null,
constraint UK_kcwu9o6nt4rruppvedp985727
unique (user_id)
);

create table wallet_transaction
(
id           bigint auto_increment
primary key,
amount       decimal(38, 2) null,
created_at   datetime(6)    null,
description  varchar(255)   null,
reference_id bigint         null,
status       varchar(255)   null,
type         varchar(255)   null,
wallet_id    bigint         not null,
user_id      bigint         null,
constraint FK6cnvafp3a0xhbs0eh9w26sett
foreign key (wallet_id) references wallet (id)
);

create table withdraw_requests
(
id             bigint auto_increment
primary key,
member_id      bigint                          not null,
amount         decimal(38, 2)                  not null,
bank_name      varchar(50)                     not null,
account_number varchar(100)                    not null,
account_holder varchar(50)                     not null,
status         varchar(30) default 'REQUESTED' not null,
requested_at   datetime                        not null,
processed_at   datetime                        null,
constraint fk_withdraw_member
foreign key (member_id) references users (id),
constraint fk_withdraw_user_id
foreign key (member_id) references users (id)
);


````
### 🛡️ Technical Challenges & Solutions

#### 1. 정산 시스템의 데이터 무결성 보장
- **문제**: 정산 프로세스 중 결제 테이블(PAID) 업데이트와 지갑 잔액(Wallet) 추가가 별개로 일어날 경우, 시스템 오류 시 데이터 불일치 대참사 발생 가능성.
- **해결**: Spring의 `@Transactional`을 활용하여 **원자성(Atomicity)** 확보. 모든 정산 과정이 하나의 트랜잭션 내에서 처리되도록 설계하여 실패 시 전체 롤백 처리.
- **학습 포인트**: Spring AOP 프록시 구조상 `private` 메서드에서는 `@Transactional`이 동작하지 않는 이슈를 파악하고, 서비스 레이어의 호출 구조를 개선하여 해결함.

#### 2. 확장성을 고려한 도메인 기반 패키지 구조
- **문제**: 기능이 추가됨에 따라 Controller와 Service가 비대해져 유지보수가 어려워짐.
- **해결**: 레이어드 아키텍처를 기반으로 하되, **도메인 단위(Quest, Wallet, Admin 등)**로 패키지를 분리하여 협업 효율성과 코드 가독성을 극대화함.



