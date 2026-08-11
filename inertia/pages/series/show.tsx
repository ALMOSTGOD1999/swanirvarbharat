import { Form, Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import React from 'react'
import { usePage } from '@inertiajs/react'
import { BookOpen, CalendarDays, Layers, ListOrdered, Lock } from 'lucide-react'

import ScrollReveal from '~/components/scroll_reveal'
import { SEOHead } from '~/components/seo_head'
import { Badge } from '~/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import DefaultLayout from '~/layouts/default'
import { cn } from '~/lib/utils'
import type { InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  series: Data.Series
  posts: Data.Post[]
  enrollment: Data.MemberEnrollment | null
  access: {
    allowed: boolean
    levelName: string
    reason: string
  }
  enrollmentSummary: {
    attemptsUsed: number
    attemptsRemaining: number
    maxAttempts: number
    canApply: boolean
  } | null
}>

function formatDate(value?: string | null) {
  if (!value) return 'Unpublished'
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function EnrollmentForm({
  series,
  enrollment,
}: {
  series: Data.Series
  enrollment: Data.MemberEnrollment | null
}) {
  const isPendingEdit = enrollment?.status === 'pending'
  const [videoSource, setVideoSource] = React.useState<'url' | 'file'>(
    (isPendingEdit ? enrollment.videoSource : 'url') as 'url' | 'file'
  )
  const { props } = usePage<{ errors?: Record<string, string> }>()
  const errors = props.errors ?? {}

  return (
    <Form
      route={isPendingEdit ? 'series.memberEnrollments.update' : 'series.memberEnrollments.store'}
      routeParams={isPendingEdit ? { slug: series.slug, id: enrollment.id } : { slug: series.slug }}
      encType="multipart/form-data"
      className="space-y-3"
    >
      <div>
        <textarea
          name="reason"
          required
          minLength={10}
          maxLength={2000}
          defaultValue={isPendingEdit ? enrollment.reason : ''}
          placeholder="Tell us why you want to join this course (min 10 characters)."
          className="min-h-28 w-full rounded-xl border bg-background px-3 py-2 text-sm"
        />
        {errors.reason ? <p className="mt-1 text-xs text-red-500">{errors.reason}</p> : null}
      </div>

      <div>
        <select
          name="videoSource"
          value={videoSource}
          onChange={(e) => setVideoSource(e.target.value as 'url' | 'file')}
          className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
        >
          <option value="url">External HTTPS video URL</option>
          <option value="file">Upload video file</option>
        </select>
        {errors.videoSource ? (
          <p className="mt-1 text-xs text-red-500">{errors.videoSource}</p>
        ) : null}
      </div>

      {videoSource === 'url' ? (
        <div>
          <input
            name="videoUrl"
            type="url"
            required
            placeholder="https://..."
            defaultValue={isPendingEdit ? (enrollment.videoUrl ?? '') : ''}
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
          />
          {errors.videoUrl ? <p className="mt-1 text-xs text-red-500">{errors.videoUrl}</p> : null}
        </div>
      ) : (
        <div>
          <input
            name="videoFile"
            type="file"
            required
            accept="video/mp4,video/webm,video/quicktime"
            className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
          />
          {errors.videoFile ? (
            <p className="mt-1 text-xs text-red-500">{errors.videoFile}</p>
          ) : null}
        </div>
      )}

      <div>
        <input
          name="contextLinks[]"
          type="url"
          placeholder="Optional context link (https://...)"
          className="w-full rounded-xl border bg-background px-3 py-2 text-sm"
        />
        {errors['contextLinks.0'] ? (
          <p className="mt-1 text-xs text-red-500">{errors['contextLinks.0']}</p>
        ) : null}
      </div>

      {Object.keys(errors).length > 0 ? (
        <p className="text-sm text-red-500">Please fix the errors above and try again.</p>
      ) : null}

      <button type="submit" className={buttonVariants()}>
        {isPendingEdit ? 'Update request' : 'Submit enrollment request'}
      </button>
    </Form>
  )
}

export default function SeriesShow({
  series,
  posts,
  enrollment,
  access,
  enrollmentSummary,
  user,
}: PageProps) {
  const canApply = Boolean(user && enrollmentSummary?.canApply && enrollment?.status !== 'approved')

  return (
    <>
      <SEOHead title={series.name} description={series.description ?? undefined} />

      <div className="px-5 py-10">
        <div className="container mx-auto max-w-4xl space-y-10">
          {/* Breadcrumb */}
          <ScrollReveal>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link route="home" />}>Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link route="series.index" />}>Courses</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{series.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </ScrollReveal>

          {/* Hero Section */}
          <ScrollReveal delay={0.1}>
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="gap-1.5">
                    <Layers className="size-3" aria-hidden="true" />
                    Courses
                  </Badge>
                  {series.state ? (
                    <Badge className="capitalize" variant="secondary">
                      {series.state}
                    </Badge>
                  ) : null}
                  <Badge variant={access.allowed ? 'outline' : 'secondary'}>
                    {access.allowed ? access.levelName : `${access.levelName} required`}
                  </Badge>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{series.name}</h1>

                {series.description ? (
                  <p className="max-w-2xl text-lg text-muted-foreground">{series.description}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ListOrdered className="size-4" aria-hidden="true" />
                  {posts.length} {posts.length === 1 ? 'lesson' : 'lessons'}
                </span>
                {series.state ? (
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="size-4" aria-hidden="true" />
                    <span className="capitalize">{series.state}</span>
                  </span>
                ) : null}
              </div>
            </div>
          </ScrollReveal>

          <Separator />

          {!access.allowed ? (
            <ScrollReveal delay={0.15}>
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="size-5" />
                    Member enrollment required
                  </CardTitle>
                  <CardDescription>
                    {enrollment?.status === 'pending'
                      ? 'Your request is pending review. You can update it while it is pending.'
                      : enrollment?.status === 'rejected'
                        ? enrollment.rejectionReason ||
                          'Your request was rejected. You can resubmit if attempts remain.'
                        : enrollment?.status === 'revoked'
                          ? enrollment.revocationReason || 'Your prior approval was revoked.'
                          : 'Apply with a short reason and video to unlock this course.'}
                  </CardDescription>
                </CardHeader>
                <CardPanel className="space-y-4">
                  {enrollmentSummary ? (
                    <p className="text-sm text-muted-foreground">
                      Attempts: {enrollmentSummary.attemptsUsed}/{enrollmentSummary.maxAttempts} ·{' '}
                      {enrollmentSummary.attemptsRemaining} remaining
                    </p>
                  ) : null}
                  {!user ? (
                    <Link route="session.create" className={buttonVariants()}>
                      Sign in to apply
                    </Link>
                  ) : canApply ? (
                    <EnrollmentForm series={series} enrollment={enrollment} />
                  ) : null}
                </CardPanel>
              </Card>
            </ScrollReveal>
          ) : null}

          {/* Lesson List */}
          <ScrollReveal delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Lessons</CardTitle>
                <CardDescription>
                  {posts.length > 0
                    ? `${posts.length} ${posts.length === 1 ? 'lesson' : 'lessons'} in this course`
                    : 'No lessons have been added to this course yet.'}
                </CardDescription>
              </CardHeader>
              <CardPanel className="pt-0">
                {posts.length > 0 ? (
                  <ol className="divide-y">
                    {posts.map((post, index) => (
                      <li key={post.id}>
                        <Link
                          route="lessons.show"
                          routeParams={{ slug: post.slug }}
                          className={cn(
                            'group flex items-start gap-4 py-4 transition-colors hover:bg-muted/40 -mx-6 px-6 rounded-lg',
                            !access.allowed && 'pointer-events-none opacity-60'
                          )}
                        >
                          {/* Lesson Number */}
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-mono text-sm font-semibold text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                            {String(index + 1).padStart(2, '0')}
                          </span>

                          {/* Content */}
                          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-medium text-foreground transition-colors group-hover:text-primary">
                                {post.title}
                              </h3>
                              {post.postType ? (
                                <Badge variant="outline" className="shrink-0">
                                  {post.postType}
                                </Badge>
                              ) : null}
                              {!access.allowed ? (
                                <Badge variant="secondary" className="shrink-0">
                                  Locked
                                </Badge>
                              ) : null}
                            </div>

                            {post.description ? (
                              <p className="line-clamp-2 text-sm text-muted-foreground">
                                {post.description}
                              </p>
                            ) : null}

                            {post.publishedAt ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <CalendarDays className="size-3" aria-hidden="true" />
                                {formatDate(post.publishedAt)}
                              </span>
                            ) : null}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <BookOpen className="size-10 text-muted-foreground/40" aria-hidden="true" />
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground">No lessons yet</p>
                      <p className="text-sm text-muted-foreground">
                        Lessons will appear here once they are added to this course.
                      </p>
                    </div>
                  </div>
                )}
              </CardPanel>
            </Card>
          </ScrollReveal>

          {/* Back Link */}
          <ScrollReveal delay={0.3}>
            <Link
              route="series.index"
              className={buttonVariants({ variant: 'outline', size: 'sm' })}
            >
              ← Back to courses
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </>
  )
}

SeriesShow.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
