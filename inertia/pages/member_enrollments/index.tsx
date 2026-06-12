import { Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import React from 'react'

import { SEOHead } from '~/components/seo_head'
import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'

type EnrollmentResource = {
  type: 'course' | 'series'
  id: string
  title: string
  slug: string
  url: string
}

type EnrollmentItem = {
  enrollment: Data.MemberEnrollment
  resource: EnrollmentResource
}

type PageProps = InertiaProps<{ items: EnrollmentItem[] }>

export default function MemberEnrollmentsIndex({ items }: PageProps) {
  return (
    <>
      <SEOHead
        title="My Enrollments"
        description="Track your Member course and series enrollment requests."
      />
      <div className="px-5 py-10">
        <div className="container mx-auto max-w-5xl space-y-8">
          <section className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              My enrollments
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">Enrollment requests</h1>
            <p className="text-muted-foreground">
              Review your pending, approved, rejected, and revoked Member access requests.
            </p>
          </section>

          <section className="grid gap-4">
            {items.map(({ enrollment, resource }) => (
              <Card key={enrollment.id}>
                <CardHeader className="gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription className="capitalize">
                        {resource.type} · attempt {enrollment.attemptNumber}
                      </CardDescription>
                    </div>
                    <Badge
                      className="capitalize"
                      variant={enrollment.status === 'approved' ? 'default' : 'secondary'}
                    >
                      {enrollment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm text-muted-foreground">
                    {enrollment.rejectionReason ? (
                      <p>Reason: {enrollment.rejectionReason}</p>
                    ) : null}
                    {enrollment.revocationReason ? (
                      <p>Revoked: {enrollment.revocationReason}</p>
                    ) : null}
                  </div>
                  <Link
                    href={resource.url}
                    className={buttonVariants({ size: 'sm', variant: 'outline' })}
                  >
                    View {resource.type}
                  </Link>
                </CardContent>
              </Card>
            ))}

            {items.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-14 text-center">
                  <h2 className="text-2xl font-semibold">No enrollment requests yet</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Member-gated courses and series you apply for will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </section>
        </div>
      </div>
    </>
  )
}

MemberEnrollmentsIndex.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
