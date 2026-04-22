'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredSubmissions } from '@/lib/quest-submissions'
import { WEB_DEVELOPMENT_QUESTS } from '@/lib/mock-quests-data'
import { GlobalNav } from '@/components/global-nav'
import { ManagerSidebar } from '@/components/manager/manager-sidebar'
import { ManagerProfileForm } from '@/components/manager/manager-profile-form'
import { PostedQuestsSection } from '@/components/manager/posted-quests-section'
import { SubmissionsReviewSection } from '@/components/manager/submissions-review-section'
import { RewardSection } from '@/components/manager/reward-section'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle } from 'lucide-react'

export default function ManagerDashboardPage() {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [savedSubmissions, setSavedSubmissions] = useState<any[]>([])

  // 1. 페이지 권한 및 유저 정보 로드
  useEffect(() => {
    const allKeys = {
      userId: localStorage.getItem('userId'),
      id: localStorage.getItem('id'),
      role: localStorage.getItem('role')
    }
    console.log("로컬스토리지 상태:", allKeys)

    // 'userId' 또는 'id'라는 키 중 존재하는 것을 숫자로 변환합니다.
    const savedId = allKeys.userId || allKeys.id
    const role = allKeys.role


    if (role !== 'MANAGER') {
      setIsAuthorized(false)
    } else {
      setIsAuthorized(true)
    }

    if (savedId) {
      setUserId(Number(savedId))
    }
  }, [])

  // 2. 제출된 데이터 로드
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

  // 3. Mock Data 설정 (메모이제이션)
  const postedQuests = useMemo(() => [
    {
      id: '1',
      title: 'React Admin Dashboard Performance Optimization',
      status: 'open' as const,
      reward: '₩1,000,000',
      submissionsCount: 8,
      createdAt: '2024-04-01',
    },
    {
      id: '3',
      title: 'REST API for Microservices Architecture',
      status: 'open' as const,
      reward: '₩1,500,000',
      submissionsCount: 5,
      createdAt: '2024-03-28',
    },
    {
      id: '4',
      title: 'Kubernetes Deployment & CI/CD Pipeline',
      status: 'completed' as const,
      reward: '₩2,000,000',
      submissionsCount: 12,
      createdAt: '2024-03-15',
    },
  ], [])

  const submissions = useMemo(() => [
    {
      id: '1',
      freelancerName: '김개발',
      questTitle: 'React Admin Dashboard Performance Optimization',
      questId: '1',
      submittedAt: '2024-04-10',
      status: 'reviewing' as const,
      githubUrl: 'https://github.com/example/react-dashboard',
    },
    {
      id: '4',
      freelancerName: '정데브옵스',
      questTitle: 'Kubernetes Deployment & CI/CD Pipeline',
      questId: '4',
      submittedAt: '2024-04-05',
      status: 'winner' as const,
      githubUrl: 'https://github.com/example/k8s-setup',
    },
  ], [])

  const allSubmissions = useMemo(
      () => [...savedSubmissions, ...submissions],
      [savedSubmissions, submissions]
  )

  const mockQuests = useMemo(() => {
    const today = new Date()
    return WEB_DEVELOPMENT_QUESTS.map((quest, index) => {
      const deadlineMatch = quest.deadline.match(/(\d+)일/)
      const daysFromNow = deadlineMatch ? parseInt(deadlineMatch[1]) : 7
      const deadlineDate = new Date(today)
      deadlineDate.setDate(today.getDate() + daysFromNow)

      return {
        id: quest.id,
        title: quest.title,
        description: quest.description,
        rewardAmount: parseInt(quest.reward.replace(/[^\d]/g, '')),
        deadline: deadlineDate.toISOString().split('T')[0],
        status: 'active' as const,
        createdAt: new Date(today.getTime() - index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }
    })
  }, [])

  return (
      <div className="min-h-screen bg-background">
        <GlobalNav />

        <div className="flex">
          <ManagerSidebar />

          <main className="flex-1">
            <div className="space-y-6 p-6 lg:p-8">
              {/* 권한 경고 */}
              {isAuthorized === false && (
                  <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 mb-6">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">권한이 없습니다</p>
                      <p className="mt-1 text-sm text-red-700">매니저 권한이 필요합니다. 로그인 상태를 확인해 주세요.</p>
                    </div>
                  </div>
              )}

              {/* 헤더 */}
              <div>
                <h1 className="text-3xl font-bold text-foreground">매니저 대시보드</h1>
                <p className="mt-1 text-muted-foreground">등록한 퀘스트와 제출 현황을 관리하세요.</p>
              </div>

              {/* 탭 영역 */}
              <Tabs defaultValue="dashboard" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="dashboard">대시보드</TabsTrigger>
                  <TabsTrigger value="profile">프로필 설정</TabsTrigger>
                </TabsList>

                {/* 대시보드 탭 내용 */}
                <TabsContent value="dashboard" className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border p-5">
                      <p className="text-sm text-muted-foreground">활성 퀘스트</p>
                      <p className="mt-2 text-3xl font-bold">{postedQuests.filter(q => q.status === 'open').length}</p>
                    </Card>
                    <Card className="border p-5">
                      <p className="text-sm text-muted-foreground">총 제출</p>
                      <p className="mt-2 text-3xl font-bold">{allSubmissions.length}</p>
                    </Card>
                    <Card className="border p-5 bg-blue-600 text-white">
                      <p className="text-sm opacity-80">총 지급액</p>
                      <p className="mt-2 text-3xl font-bold">₩4,500,000</p>
                    </Card>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                      <PostedQuestsSection quests={postedQuests} />
                    </div>
                    <div className="space-y-6">
                      <Card className="border p-6">
                        <h3 className="text-lg font-semibold mb-4">퀘스트 데드라인 캘린더</h3>
                        <Calendar quests={mockQuests} className="w-full" />
                      </Card>
                      <RewardSection />
                    </div>
                  </div>

                  <SubmissionsReviewSection submissions={allSubmissions} />
                </TabsContent>

                {/* 프로필 설정 탭 내용 */}
                <TabsContent value="profile">
                  {userId ? (
                      <ManagerProfileForm userId={userId} />
                  ) : (
                      <Card className="p-10 text-center border border-dashed text-muted-foreground">
                        사용자 정보를 불러오는 중입니다...
                      </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
  )
}