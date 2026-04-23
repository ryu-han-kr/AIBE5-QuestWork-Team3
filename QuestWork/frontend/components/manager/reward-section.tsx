'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function RewardSection() {
  const selectedWinner = {
    name: 'Kim Developer',
    reward: '1,500,000 KRW',
    questTitle: 'REST API for Microservices Architecture',
  }

  return (
    <Card className="border border-border shadow-none">
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Reward Management
          </h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Keep payment status visible and move from winner selection to payout.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-surface p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-foreground-muted">Selected winner</p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">
                {selectedWinner.name}
              </h3>
              <p className="mt-1 text-sm text-foreground-muted">
                {selectedWinner.questTitle}
              </p>
            </div>
            <Badge className="bg-green-100 text-green-700">Winner</Badge>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-foreground-muted">
            Reward amount
          </p>
          <p className="mt-2 text-3xl font-bold text-primary">
            {selectedWinner.reward}
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-sm text-foreground">Payment pending</span>
          </div>
          <p className="text-xs text-foreground-muted">
            Confirming the payout will release the reward to the selected freelancer.
          </p>
        </div>

        <div className="mt-6 flex gap-3 pt-2">
          <Button variant="outline" className="flex-1">
            Cancel Payment
          </Button>
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hover">
            Confirm and Pay
          </Button>
        </div>
      </div>
    </Card>
  )
}
