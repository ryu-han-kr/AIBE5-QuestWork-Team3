"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { MemberTable } from "@/components/admin/member-table"
import { MemberStats } from "@/components/admin/member-stats"
import { SearchFilter } from "@/components/admin/search-filter"

// 백엔드 Enum 및 DB 값과 일치하도록 대문자 중심 설정
export type Role = "ADMIN" | "MANAGER" | "USER" |"MEMBER"
export type Status = "ACTIVE" | "INACTIVE" | "DELETED"

export interface Member {
  id: string
  name: string
  email: string
  role: Role
  status: Status
  joinDate: string
  lastLogin: string
}

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "전체">("전체")
  const [statusFilter, setStatusFilter] = useState<Status | "전체">("전체")

  useEffect(() => {
    fetchMembers()
  }, [])

  // 1. 회원 목록 로드
  const fetchMembers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/users?page=0&size=100")
      if (!response.ok) throw new Error("데이터를 가져오는데 실패했습니다.")

      const data = await response.json()

      // AdminPage.tsx 내부의 fetchMembers 수정
      const mappedMembers: Member[] = data.content.map((user: any) => {
        // 💡 브라우저 콘솔에 찍어서 백엔드가 정확히 어떤 키값으로 주는지 확인해보세요.
        // console.log("백엔드 유저 데이터:", user);

        return {
          id: user.id.toString(),
          name: user.nickname,
          email: user.email,
          // 💡 아래 세 가지 중 하나가 맞을 확률이 높습니다.
          // 백엔드 DTO의 변수명을 확인하여 수정하세요.
          role: (user.roleName || user.role || "USER") as Role,
          status: user.status || "ACTIVE",
          joinDate: user.createdAt ? user.createdAt.split("T")[0] : "-",
          lastLogin: "-",
        };
      });

      setMembers(mappedMembers)
    } catch (error) {
      console.error("회원 로드 중 오류 발생:", error)
    }
  }

  // 2. 상태 변경 (활성화/비활성화/삭제)
  const handleStatusChange = async (memberId: string, newLabel: Status) => {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/users/${memberId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLabel),
      });

      if (response.ok) {
        setMembers((prev) =>
            prev.map((member) =>
                member.id === memberId ? { ...member, status: newLabel } : member
            )
        );
      } else {
        alert("상태 변경 실패 (Error: " + response.status + ")");
      }
    } catch (error) {
      console.error("통신 에러:", error);
    }
  };

  // 3. 권한 변경 (403 에러 방지를 위해 객체 형태로 전송)
  const handleRoleChange = async (memberId: string, newRole: Role) => {
    try {
      const roleToSend = newRole.toUpperCase();

      const response = await fetch(`http://localhost:8000/api/admin/users/${memberId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        // 핵심: { "roleName": "ADMIN" } 형태로 전송
        body: JSON.stringify({ roleName: roleToSend }),
      });

      if (response.ok) {
        setMembers((prev) =>
            prev.map((member) =>
                member.id === memberId ? { ...member, role: newRole } : member
            )
        );
        console.log(`유저 ${memberId}의 권한이 ${newRole}로 변경되었습니다.`);
      } else {
        console.error("403 Forbidden 등 에러 발생:", response.status);
        alert("권한 변경에 실패했습니다. 백엔드 컨트롤러가 Map/DTO로 받는지 확인하세요.");
      }
    } catch (error) {
      console.error("통신 에러:", error);
    }
  }

  // 4. 회원 삭제
  const handleDeleteMember = async (memberId: string) => {
    if(confirm("정말로 이 회원을 삭제하시겠습니까?")) {
      await handleStatusChange(memberId, "DELETED");
    }
  }

  // 필터링 로직
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "전체" || member.role === roleFilter
    const matchesStatus = statusFilter === "전체" || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  // 통계 데이터 계산
  const stats = {
    total: members.length,
    active: members.filter((m) => m.status === "ACTIVE").length,
    inactive: members.filter((m) => m.status === "INACTIVE").length,
    deleted: members.filter((m) => m.status === "DELETED").length,

    admins: members.filter((m) => m.role === "ADMIN").length,

    // 💡 매니저가 안 읽힌다면 DB의 "MANAGER" 글자와 정확히 일치하는지 확인!
    managers: members.filter((m) => m.role === "MANAGER").length,

    // 💡 MEMBER와 USER를 모두 '일반 회원' 숫자에 포함시킵니다.
    users: members.filter((m) => m.role === "USER" || m.role === "MEMBER").length,
  }

  return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">회원 관리</h1>
            <p className="mt-2 text-muted-foreground">
              실시간 데이터베이스 연동 및 보안 최적화 완료
            </p>
          </div>

          <MemberStats stats={stats} />

          <SearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              roleFilter={roleFilter}
              onRoleFilterChange={setRoleFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
          />

          <MemberTable
              members={filteredMembers}
              onRoleChange={handleRoleChange}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteMember}
          />
        </main>
      </div>
  )
}