import { useState } from 'react'
import { router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import type { InertiaProps } from '~/types'
import AdminLayout from '~/layouts/admin'
import { Card, CardPanel } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'

type PageProps = InertiaProps<{
  applications: any[]
  pagination: any
  currentStatus: string
}>

const STATUS_OPTIONS = [
  '',
  'email_verified',
  'onboarding_started',
  'submitted',
  'under_review',
  'approved',
  'rejected',
]

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    under_review: 'bg-yellow-100 text-yellow-800',
    submitted: 'bg-blue-100 text-blue-800',
  }
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${variants[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  )
}

export default function AdminCandidatesIndex({
  applications,
  pagination,
  currentStatus,
}: PageProps) {
  const [filter, setFilter] = useState(currentStatus)

  const handleFilter = (status: string) => {
    setFilter(status)
    router.get('/admin/candidates', { status }, { preserveState: true })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Candidate Applications</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardPanel className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Applicant</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Submitted</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app: any) => (
                <tr key={app.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="p-3 font-medium">
                    {app.fullName || app.user?.profile?.name || app.user?.username || '—'}
                  </td>
                  <td className="p-3 text-muted-foreground">{app.user?.email || '—'}</td>
                  <td className="p-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      render={<Link href={`/admin/candidates/${app.id}`} />}
                    >
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardPanel>
      </Card>
    </div>
  )
}

AdminCandidatesIndex.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
