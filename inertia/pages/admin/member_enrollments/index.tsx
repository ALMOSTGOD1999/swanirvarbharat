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
type EnrollmentItem = { enrollment: Data.MemberEnrollment; resource: EnrollmentResource }
type PageProps = InertiaProps<{ items: EnrollmentItem[]; status: string; resourceType: string }>

export default function AdminMemberEnrollmentsIndex({ items }: PageProps) {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Member enrollments</h1>
        <p className="text-muted-foreground">Review course and series Member access requests.</p>
      </div>
      <div className="grid gap-4">
        {items.map(({ enrollment, resource }) => (
          <Card key={enrollment.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <CardTitle>{resource.title}</CardTitle>
                  <p className="text-sm text-muted-foreground capitalize">
                    {resource.type} · {enrollment.user?.username ?? enrollment.userId}
                  </p>
                </div>
                <Badge className="capitalize">{enrollment.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              <Link
                route="admin.memberEnrollments.show"
                routeParams={{ id: enrollment.id }}
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
              >
                Review
              </Link>
              {enrollment.status === 'pending' ? (
                <Form route="admin.memberEnrollments.approve" routeParams={{ id: enrollment.id }}>
                  <button className={buttonVariants({ size: 'sm' })} type="submit">
                    Approve
                  </button>
                </Form>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

AdminMemberEnrollmentsIndex.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
