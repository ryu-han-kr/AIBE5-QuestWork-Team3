"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import { getStoredSubmissions } from "@/lib/quest-submissions";
import { GlobalNav } from "@/components/global-nav";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatCard } from "@/components/dashboard/stat-card";
import { ManagerProfileForm } from "@/components/manager/manager-profile-form";
import { ManagerSidebar } from "@/components/manager/manager-sidebar";
import { PostedQuestsSection } from "@/components/manager/posted-quests-section";
import { RewardSection } from "@/components/manager/reward-section";
import { SubmissionsReviewSection } from "@/components/manager/submissions-review-section";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

interface StoredSubmission {
  id: string;
  freelancerName: string;
  questTitle: string;
  questId: string;
  submittedAt: string;
  status: "reviewing" | "winner" | "rejected";
  githubUrl: string;
}

export default function ManagerDashboardPage() {
  const [dbQuests, setDbQuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [savedSubmissions, setSavedSubmissions] = useState<StoredSubmission[]>(
    [],
  );

  useEffect(() => {
    const savedId =
      localStorage.getItem("userId") || localStorage.getItem("id");
    const role = localStorage.getItem("role");

    setIsAuthorized(role === "MANAGER");

    if (savedId) {
      setUserId(Number(savedId));
    }
  }, []);

  useEffect(() => {
    const fetchQuests = async () => {
      if (!userId) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/quests/manager/${userId}`,
        );
        if (!response.ok) throw new Error("Failed to load manager quests");
        const data = await response.json();
        setDbQuests(data);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized === true) {
      fetchQuests();
    }
  }, [isAuthorized, userId]);

  useEffect(() => {
    const stored = getStoredSubmissions().map((submission) => ({
      id: submission.id,
      freelancerName: submission.freelancerName,
      questTitle: submission.questTitle,
      questId: submission.questId,
      submittedAt: submission.submittedAt,
      status: "reviewing" as const,
      githubUrl:
        submission.githubUrl ??
        `File submission: ${submission.fileName ?? "attachment"}`,
    }));

    setSavedSubmissions(stored);
  }, []);

  const mockSubmissions = useMemo(
    () => [
      {
        id: "mock-1",
        freelancerName: "Kim Developer",
        questTitle: "React Admin Dashboard Performance Optimization",
        questId: "1",
        submittedAt: "2024-04-10",
        status: "reviewing" as const,
        githubUrl: "https://github.com/example/react-dashboard",
      },
    ],
    [],
  );

  const allSubmissions = useMemo(
    () => [...savedSubmissions, ...mockSubmissions],
    [mockSubmissions, savedSubmissions],
  );

  const activeQuestCount = dbQuests.filter(
    (quest) => quest.status === "OPEN",
  ).length;
  const closedQuestCount = dbQuests.filter(
    (quest) => quest.status !== "OPEN",
  ).length;
  const totalRewardBudget = dbQuests.reduce(
    (acc, quest) => acc + (quest.rewardAmount || 0),
    0,
  );
  const reviewingCount = allSubmissions.filter(
    (submission) => submission.status === "reviewing",
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell sidebar={<ManagerSidebar />}>
        <div className="space-y-8">
          {isAuthorized === false && (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">매니저 권한이 필요합니다</p>
                <p className="mt-1 text-sm text-red-700">
                  이 화면은 매니저 계정으로 로그인해야 사용할 수 있습니다.
                </p>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-primary">Manager Dashboard</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              퀘스트 등록부터 제출 검토, 보상 관리까지 한곳에서 확인하세요
            </h1>
            <p className="mt-2 max-w-3xl text-foreground-muted">
              매니저 전용 워크스페이스에서 등록한 퀘스트 현황과 제출 결과,
              보상 진행 상황을 한눈에 관리할 수 있습니다.
            </p>
          </div>

          <div className="space-y-8">
            <section
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
              aria-label="매니저 대시보드 요약"
            >
              <StatCard
                label="진행 중인 퀘스트"
                value={String(activeQuestCount)}
                subtext="현재 지원 및 제출을 받고 있는 퀘스트"
              />
              <StatCard
                label="종료된 퀘스트"
                value={String(closedQuestCount)}
                subtext="마감되었거나 정리된 퀘스트"
              />
              <StatCard
                label="총 제출 수"
                value={String(allSubmissions.length)}
                subtext={`현재 ${reviewingCount}건 검토 중`}
              />
              <StatCard
                label="총 보상 금액"
                value={`${totalRewardBudget.toLocaleString()} KRW`}
                subtext={
                  isLoading
                    ? "최신 데이터를 불러오는 중입니다"
                    : "등록된 퀘스트의 보상 금액 합계"
                }
                accent
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div id="posted-quests" className="xl:col-span-2">
                <PostedQuestsSection quests={dbQuests} />
              </div>

              <div className="space-y-6">
                <Card className="border border-border shadow-none">
                  <div className="p-6">
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-foreground">
                        퀘스트 일정
                      </h2>
                      <p className="mt-1 text-sm text-foreground-muted">
                        등록 일정과 검토 시점을 빠르게 확인해보세요.
                      </p>
                    </div>
                    <Calendar quests={dbQuests} className="w-full" />
                  </div>
                </Card>

                <div id="reward-management">
                  <RewardSection />
                </div>
              </div>
            </section>

            <section id="submission-review">
              <SubmissionsReviewSection submissions={allSubmissions} />
            </section>

            <section id="profile-settings" className="scroll-mt-24">
              {userId ? (
                <ManagerProfileForm userId={userId} />
              ) : (
                <Card className="border border-dashed border-border p-10 text-center text-muted-foreground shadow-none">
                  매니저 프로필 정보를 불러오는 중입니다...
                </Card>
              )}
            </section>
          </div>
        </div>
      </DashboardShell>
    </div>
  );
}
