import type { InertiaProps } from '~/types'
import DefaultLayout from '~/layouts/default'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { cn } from '~/lib/utils'

type PageProps = InertiaProps<{
  application: any
  user: any
}>

const STATUS_FLOW = [
  { key: 'email_verified', label: 'Registered', description: 'Account created and email verified' },
  { key: 'onboarding_started', label: 'Profile Completed', description: 'Personal information submitted' },
  { key: 'submitted', label: 'Application Submitted', description: 'All documents uploaded and submitted' },
  { key: 'under_review', label: 'Under Review', description: 'Admin is reviewing your application' },
  { key: 'approved', label: 'Approved', description: 'Congratulations! Your application is approved' },
]

function getStatusIndex(status: string): number {
  const idx = STATUS_FLOW.findIndex((s) => s.key === status)
  return idx >= 0 ? idx : 0
}

export default function ApplicationStatus({ application, user }: PageProps) {
  if (!application) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-3xl font-semibold mb-4">No Application Found</h1>
        <p className="text-muted-foreground mb-8">You haven't started your onboarding process yet.</p>
        <Button render={<Link href="/onboarding" />}>Start Onboarding</Button>
      </div>
    )
  }

  const currentIdx = getStatusIndex(application.status)
  const isRejected = application.status === 'rejected'
  const isApproved = application.status === 'approved'

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="text-3xl font-semibold mb-2">Application Status</h1>
      <p className="text-muted-foreground mb-8">Track the progress of your application.</p>

      {/* Status badge */}
      <Card className="mb-8">
        <CardPanel className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Current Status</p>
            <p className={cn(
              'text-xl font-semibold capitalize',
              isApproved && 'text-green-600',
              isRejected && 'text-destructive',
            )}>
              {isRejected ? 'Rejected' : application.status.replace(/_/g, ' ')}
            </p>
            {isRejected && application.adminRemarks && (
              <p className="text-sm text-destructive mt-2">Reason: {application.adminRemarks}</p>
            )}
          </div>
          {!isApproved && !isRejected && application.status !== 'submitted' && (
            <Button variant="outline" render={<Link href="/onboarding" />}>
              Continue Onboarding
            </Button>
          )}
        </CardPanel>
      </Card>

      {/* Progress timeline */}
      <div className="relative space-y-0">
        {STATUS_FLOW.map((step, i) => {
          const isComplete = i <= currentIdx && !isRejected
          const isCurrent = i === currentIdx && !isRejected

          return (
            <div key={step.key} className="flex gap-4 pb-8 last:pb-0">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'size-8 rounded-full flex items-center justify-center text-sm font-medium z-10',
                  isComplete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  isCurrent && 'ring-2 ring-primary/30',
                )}>
                  {isComplete ? '✓' : i + 1}
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <div className={cn(
                    'w-0.5 flex-1 mt-1',
                    isComplete && i < currentIdx ? 'bg-primary' : 'bg-muted',
                  )} />
                )}
              </div>
              {/* Content */}
              <div className={cn('pt-1', isCurrent && 'font-medium')}>
                <p className="text-sm">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          )
        })}

        {/* Rejected state */}
        {isRejected && (
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="size-8 rounded-full flex items-center justify-center text-sm font-medium bg-destructive text-destructive-foreground">✕</div>
            </div>
            <div className="pt-1">
              <p className="text-sm font-medium text-destructive">Rejected</p>
              <p className="text-xs text-muted-foreground">Your application was not approved.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

ApplicationStatus.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
