'use client'

import { useEffect, useMemo, useState } from 'react'
import { getStoredSubmissions } from '@/lib/quest-submissions'
import { GlobalNav } from '@/components/global-nav'
import { ManagerSidebar } from '@/components/manager/manager-sidebar'
import { PostedQuestsSection } from '@/components/manager/posted-quests-section'
import { SubmissionsReviewSection } from '@/components/manager/submissions-review-section'
import { RewardSection } from '@/components/manager/reward-section'
import { Card } from '@/components/ui/card'
import {
  fetchQuestsByManager,
  formatReward,
  getStoredUser,
  type QuestResponse,
} from '@/lib/api'

interface PostedQuest {
  id: string
  title: string
  status: 'open' | 'completed'
  reward: string
  submissionsCount: number
  createdAt: string
}

function toPostedQuest(q: QuestResponse): PostedQuest {
  return {
    id: String(q.id),
    title: q.title,
    status: q.status === 'OPEN' || q.status === 'IN_PROCESS' ? 'open' : 'completed',
    reward: formatReward(q.rewardAmount),
    submissionsCount: 0,
    createdAt: q.createdAt?.slice(0, 10) ?? '',
  }
}

export default function ManagerDashboardPage() {
  const [postedQuests, setPostedQuests] = useState<PostedQuest[]>([])
  const [savedSubmissions, setSavedSubmissions] = useState<
    {
      id: string
      freelancerName: string
      questTitle: string
      questId: string
      submittedAt: string
      status: 'reviewing' | 'winner' | 'rejected'
      githubUrl: string
    }[]
  >([])

  useEffect(() => {
    const stored = getStoredSubmissions().map((submission) => ({
      id: submission.id,
      freelancerName: submission.freelancerName,
      questTitle: submission.questTitle,
      questId: submission.questId,
      submittedAt: submission.submittedAt,
      status: 'reviewing' as const,
      githubUrl: submission.githubUrl ?? `파일 제출: ${submission.fileName ?? '첨부파일'}`,
    }))
    setSavedSubmissions(stored)
  }, [])

  useEffect(() => {
    const user = getStoredUser()
    if (!user) return
    fetchQuestsByManager(user.id)
      .then((data) => setPostedQuests(data.map(toPostedQuest)))
      .catch((err) => console.error('매니저 퀘스트 불러오기 실패:', err))
  }, [])

  const allSubmissions = useMemo(() => savedSubmissions, [savedSubmissions])

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="flex">
        <ManagerSidebar />

        <main className="flex-1">
          <div className="space-y-6 p-6 lg:p-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">매니저 대시보드</h1>
              <p className="mt-1 text-foreground-muted">
                등록한 퀘스트와 제출 현황을 관리하세요.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="border border-border p-5">
                <p className="text-sm text-foreground-muted">활성 퀘스트</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {postedQuests.filter((q) => q.status === 'open').length}
                </p>
              </Card>
              <Card className="border border-border p-5">
                <p className="text-sm text-foreground-muted">총 제출</p>
                <p className="mt-2 text-3xl font-bold text-foreground">
                  {allSubmissions.length}
                </p>
              </Card>
              <Card className="border border-border p-5 bg-primary">
                <p className="text-sm text-primary-foreground/80">등록된 퀘스트</p>
                <p className="mt-2 text-3xl font-bold text-primary-foreground">
                  {postedQuests.length}
                </p>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-6">
                <PostedQuestsSection quests={postedQuests} />
              </div>
              <div className="space-y-6">
                <RewardSection />
              </div>
            </div>

            <SubmissionsReviewSection submissions={allSubmissions} />
          </div>
        </main>
      </div>
    </div>
  )
}
