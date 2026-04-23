'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { getStoredSubmissions } from '@/lib/quest-submissions'
import { GlobalNav } from '@/components/global-nav'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { StatCard } from '@/components/dashboard/stat-card'
import { ManagerProfileForm } from '@/components/manager/manager-profile-form'
import { ManagerSidebar } from '@/components/manager/manager-sidebar'
import { PostedQuestsSection } from '@/components/manager/posted-quests-section'
import { RewardSection } from '@/components/manager/reward-section'
import { SubmissionsReviewSection } from '@/components/manager/submissions-review-section'
import { Calendar } from '@/components/ui/calendar'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StoredSubmission {
  id: string
  freelancerName: string
  questTitle: string
  questId: string
  submittedAt: string
  status: 'reviewing' | 'winner' | 'rejected'
  githubUrl: string
}

export default function ManagerDashboardPage() {
  const pathname = usePathname()
  const [dbQuests, setDbQuests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [savedSubmissions, setSavedSubmissions] = useState<StoredSubmission[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const savedId = localStorage.getItem('userId') || localStorage.getItem('id')
    const role = localStorage.getItem('role')

    setIsAuthorized(role === 'MANAGER')

    if (savedId) {
      setUserId(Number(savedId))
    }
  }, [])

  useEffect(() => {
    const fetchQuests = async () => {
      if (!userId) return

      setIsLoading(true)
      try {
        const response = await fetch(`http://localhost:8000/api/quests/manager/${userId}`)
        if (!response.ok) throw new Error('Failed to load manager quests')
        const data = await response.json()
        setDbQuests(data)
      } catch (error) {
        console.error('Fetch Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthorized === true) {
      fetchQuests()
    }
  }, [isAuthorized, userId])

  useEffect(() => {
    const stored = getStoredSubmissions().map((submission) => ({
      id: submission.id,
      freelancerName: submission.freelancerName,
      questTitle: submission.questTitle,
      questId: submission.questId,
      submittedAt: submission.submittedAt,
      status: 'reviewing' as const,
      githubUrl: submission.githubUrl ?? `File submission: ${submission.fileName ?? 'attachment'}`,
    }))

    setSavedSubmissions(stored)
  }, [])

  useEffect(() => {
    const syncTabWithHash = () => {
      const hash = window.location.hash
      setActiveTab(hash === '#profile-settings' ? 'profile' : 'overview')
    }

    syncTabWithHash()
    window.addEventListener('hashchange', syncTabWithHash)

    return () => window.removeEventListener('hashchange', syncTabWithHash)
  }, [pathname])

  const mockSubmissions = useMemo(
    () => [
      {
        id: 'mock-1',
        freelancerName: 'Kim Developer',
        questTitle: 'React Admin Dashboard Performance Optimization',
        questId: '1',
        submittedAt: '2024-04-10',
        status: 'reviewing' as const,
        githubUrl: 'https://github.com/example/react-dashboard',
      },
    ],
    [],
  )

  const allSubmissions = useMemo(
    () => [...savedSubmissions, ...mockSubmissions],
    [mockSubmissions, savedSubmissions],
  )

  const activeQuestCount = dbQuests.filter((quest) => quest.status === 'OPEN').length
  const closedQuestCount = dbQuests.filter((quest) => quest.status !== 'OPEN').length
  const totalRewardBudget = dbQuests.reduce(
    (acc, quest) => acc + (quest.rewardAmount || 0),
    0,
  )
  const reviewingCount = allSubmissions.filter(
    (submission) => submission.status === 'reviewing',
  ).length

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <DashboardShell sidebar={<ManagerSidebar />}>
        <div className="space-y-8">
          {isAuthorized === false && (
            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">
                  Manager access is required
                </p>
                <p className="mt-1 text-sm text-red-700">
                  Please sign in with a manager account to use this workspace.
                </p>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-primary">Manager Overview</p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              Manage quests, reviews, and rewards in one workspace
            </h1>
            <p className="mt-2 max-w-3xl text-foreground-muted">
              The manager workspace now follows the same layout and interaction rhythm as the
              freelancer dashboard while preserving manager-specific tools and data.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="h-auto rounded-full border border-border/70 bg-white/70 p-1 shadow-sm shadow-black/5">
              <TabsTrigger value="overview" className="rounded-full px-4">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="profile" className="rounded-full px-4">
                Profile Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <section
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                aria-label="Manager overview stats"
              >
                <StatCard
                  label="Active Quests"
                  value={String(activeQuestCount)}
                  subtext="Currently open for submissions"
                />
                <StatCard
                  label="Closed Quests"
                  value={String(closedQuestCount)}
                  subtext="Completed or archived postings"
                />
                <StatCard
                  label="Total Submissions"
                  value={String(allSubmissions.length)}
                  subtext={`${reviewingCount} currently under review`}
                />
                <StatCard
                  label="Reward Budget"
                  value={`${totalRewardBudget.toLocaleString()} KRW`}
                  subtext={isLoading ? 'Refreshing from the backend' : 'Combined reward amount across posted quests'}
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
                          Quest Timeline
                        </h2>
                        <p className="mt-1 text-sm text-foreground-muted">
                          Keep an eye on publishing cadence and upcoming review windows.
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
            </TabsContent>

            <TabsContent value="profile">
              <section id="profile-settings">
                {userId ? (
                  <ManagerProfileForm userId={userId} />
                ) : (
                  <Card className="border border-dashed border-border p-10 text-center text-muted-foreground shadow-none">
                    Loading manager profile information...
                  </Card>
                )}
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardShell>
    </div>
  )
}
