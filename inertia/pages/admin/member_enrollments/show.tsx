import { Form, Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import React from 'react'

import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import AdminLayout from '~/layouts/admin'
import type { InertiaProps } from '~/types'

type EnrollmentResource = {
  type: 'course' | 'series'
  id: string
  title: string
  slug: string
  url: string
}
type EnrollmentWithLinks = Data.MemberEnrollment & { contextLinks?: string[] | null }
type PageProps = InertiaProps<{ enrollment: EnrollmentWithLinks; resource: EnrollmentResource }>

export default function AdminMemberEnrollmentsShow({ enrollment, resource }: PageProps) {
  const contextLinks: string[] = Array.isArray(enrollment.contextLinks)
    ? enrollment.contextLinks.filter((link): link is string => typeof link === 'string')
    : []

  return (
    <div className="space-y-6 p-6">
      <Link
        route="admin.memberEnrollments.index"
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
      >
        Back
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{resource.title}</h1>
          <p className="text-muted-foreground capitalize">
            {resource.type} request from {enrollment.user?.username ?? enrollment.userId}
          </p>
        </div>
        <Badge className="capitalize">{enrollment.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="whitespace-pre-wrap text-sm">{enrollment.reason}</p>
          {enrollment.videoUrl ? (
            <a
              href={enrollment.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary underline"
            >
              Open submitted video
            </a>
          ) : null}
          {contextLinks.map((link) => (
            <a
              key={link}
              href={link}
              target="_blank"
              rel="noreferrer"
              className="block text-sm text-primary underline"
            >
              {link}
            </a>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {enrollment.status === 'pending' ? (
            <Form route="admin.memberEnrollments.approve" routeParams={{ id: enrollment.id }}>
              <button className={buttonVariants()} type="submit">
                Approve
              </button>
            </Form>
          ) : null}
          <Form route="admin.memberEnrollments.reject" routeParams={{ id: enrollment.id }}>
            <textarea
              name="rejectionReason"
              required
              minLength={3}
              placeholder="Rejection reason"
              className="mb-2 min-h-20 w-full rounded-xl border bg-background px-3 py-2 text-sm"
            />
            <button className={buttonVariants({ variant: 'outline' })} type="submit">
              Reject
            </button>
          </Form>
          <Form route="admin.memberEnrollments.revoke" routeParams={{ id: enrollment.id }}>
            <textarea
              name="revocationReason"
              placeholder="Revocation reason"
              className="mb-2 min-h-20 w-full rounded-xl border bg-background px-3 py-2 text-sm"
            />
            <button className={buttonVariants({ variant: 'destructive' })} type="submit">
              Revoke
            </button>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

AdminMemberEnrollmentsShow.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
