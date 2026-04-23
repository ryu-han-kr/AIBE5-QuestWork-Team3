'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SubmissionModal } from './submission-modal'

interface Submission {
  id: string
  freelancerName: string
  questTitle: string
  questId: string
  submittedAt: string
  status: 'reviewing' | 'winner' | 'rejected'
  githubUrl: string
}

interface SubmissionsReviewSectionProps {
  submissions: Submission[]
}

const statusBadgeColor = {
  reviewing: 'bg-blue-100 text-blue-700',
  winner: 'bg-green-100 text-green-700',
  rejected: 'bg-slate-100 text-slate-700',
}

const statusLabel = {
  reviewing: 'Reviewing',
  winner: 'Winner',
  rejected: 'Rejected',
}

export function SubmissionsReviewSection({
  submissions,
}: SubmissionsReviewSectionProps) {
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null)

  return (
    <>
      <Card className="border border-border shadow-none">
        <div className="p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Submission Review
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              Compare incoming work and move quickly from review to decision.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Freelancer</TableHead>
                <TableHead>Quest</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center">
                    <p className="text-foreground-muted">
                      No submissions are waiting for review.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                submissions.map((submission) => (
                  <TableRow key={submission.id} className="hover:bg-surface-raised">
                    <TableCell className="font-medium text-foreground">
                      {submission.freelancerName}
                    </TableCell>
                    <TableCell className="text-foreground-muted">
                      {submission.questTitle}
                    </TableCell>
                    <TableCell className="text-foreground-muted">
                      {submission.submittedAt}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusBadgeColor[submission.status]}>
                        {statusLabel[submission.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSubmission(submission)}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedSubmission && (
        <SubmissionModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onSelect={(id) => {
            console.log('[manager-dashboard] Winner selected:', id)
            setSelectedSubmission(null)
          }}
        />
      )}
    </>
  )
}
