import { useState } from 'react'
import { router } from '@inertiajs/react'
import type { InertiaProps } from '~/types'
import AdminLayout from '~/layouts/admin'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Badge } from '~/components/ui/badge'

type PageProps = InertiaProps<{
  application: any
}>

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

export default function AdminCandidatesShow({ application }: PageProps) {
  const app = application
  const [remark, setRemark] = useState('')
  const [rejectReason, setRejectReason] = useState('')

  const handleApprove = () => {
    if (confirm('Approve this application?')) {
      router.post(`/admin/candidates/${app.id}/approve`)
    }
  }

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:')
    if (reason !== null) {
      router.post(`/admin/candidates/${app.id}/reject`, { reason })
    }
  }

  const handleRemark = () => {
    if (remark.trim()) {
      router.post(`/admin/candidates/${app.id}/remark`, { remark })
      setRemark('')
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {app.fullName || app.user?.profile?.name || 'Applicant'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {app.user?.email} · <StatusBadge status={app.status} />
          </p>
        </div>
        <div className="flex gap-2">
          {app.status !== 'approved' && (
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
              Approve
            </Button>
          )}
          {app.status !== 'rejected' && (
            <Button onClick={handleReject} variant="destructive">
              Reject
            </Button>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardPanel>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Full Name:</span>{' '}
              <span className="font-medium">{app.fullName || '—'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Gender:</span>{' '}
              <span className="font-medium capitalize">{app.gender || '—'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Age:</span>{' '}
              <span className="font-medium">{app.age || '—'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Education:</span>{' '}
              <span className="font-medium">{app.educationalQualification || '—'}</span>
            </div>
          </div>
        </CardPanel>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardPanel className="space-y-2">
          {[
            { key: 'certificate10th', label: '10th Certificate' },
            { key: 'certificate12th', label: '12th Certificate' },
            { key: 'certificateGraduation', label: 'Graduation' },
            { key: 'certificatePostGraduation', label: 'Post Graduation' },
            { key: 'passportPhoto', label: 'Passport Photo' },
          ].map((doc) => (
            <div key={doc.key} className="flex items-center justify-between rounded-lg border p-3">
              <span className="text-sm">{doc.label}</span>
              {(app as any)[doc.key] ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open((app as any)[doc.key].url, '_blank')}
                >
                  View Document
                </Button>
              ) : (
                <span className="text-xs text-muted-foreground">Not uploaded</span>
              )}
            </div>
          ))}
        </CardPanel>
      </Card>

      {/* Introduction Video */}
      {app.introductionVideo && (
        <Card>
          <CardHeader>
            <CardTitle>Introduction Video</CardTitle>
          </CardHeader>
          <CardPanel>
            <video
              src={app.introductionVideo.url}
              controls
              className="w-full max-w-lg rounded-lg border"
            />
          </CardPanel>
        </Card>
      )}

      {/* KYC */}
      {app.kycDocument && (
        <Card>
          <CardHeader>
            <CardTitle>KYC Document</CardTitle>
          </CardHeader>
          <CardPanel className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {app.kycType === 'aadhaar' ? 'Aadhaar Card' : 'Voter ID Card'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(app.kycDocument.url, '_blank')}
              >
                View Document
              </Button>
            </div>
            {app.phone && <div className="text-sm text-muted-foreground">Phone: {app.phone}</div>}
          </CardPanel>
        </Card>
      )}

      {/* Purpose */}
      {app.purposeVideo && (
        <Card>
          <CardHeader>
            <CardTitle>Purpose Video</CardTitle>
          </CardHeader>
          <CardPanel>
            <video
              src={app.purposeVideo.url}
              controls
              className="w-full max-w-lg rounded-lg border"
            />
          </CardPanel>
        </Card>
      )}
      {app.purposeDescription && (
        <Card>
          <CardHeader>
            <CardTitle>Purpose Description</CardTitle>
          </CardHeader>
          <CardPanel>
            <p className="text-sm whitespace-pre-wrap">{app.purposeDescription}</p>
          </CardPanel>
        </Card>
      )}

      {/* Admin Remarks */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Remarks</CardTitle>
          <CardDescription>Add notes or remarks about this application.</CardDescription>
        </CardHeader>
        <CardPanel className="space-y-4">
          {app.adminRemarks && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium text-xs text-muted-foreground mb-1">Previous Remark:</p>
              <p>{app.adminRemarks}</p>
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Add a remark..."
              rows={2}
              className="flex-1"
            />
            <Button onClick={handleRemark} disabled={!remark.trim()}>
              Add Remark
            </Button>
          </div>
        </CardPanel>
      </Card>
    </div>
  )
}

AdminCandidatesShow.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
