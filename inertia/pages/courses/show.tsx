import { Form, Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import { Lock, PlayCircle } from 'lucide-react'
import React from 'react'

import { SEOHead } from '~/components/seo_head'
import { Badge } from '~/components/ui/badge'
import { Button, buttonVariants } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'

type CourseModule = {
  id: string
  name: string
  notes: string | null
  sortOrder: number
  lessons: Data.Post[]
}

type ResourceAccess = {
  allowed: boolean
  levelName: string
  reason: string
}

type EnrollmentSummary = {
  attemptsUsed: number
  attemptsRemaining: number
  maxAttempts: number
  canApply: boolean
} | null

type PageProps = InertiaProps<{
  course: Data.Course
  modules: CourseModule[]
  access: ResourceAccess
  enrollment: Data.MemberEnrollment | null
  enrollmentSummary: EnrollmentSummary
}>

function EnrollmentForm({
  course,
  enrollment,
}: {
  course: Data.Course
  enrollment: Data.MemberEnrollment | null
}) {
  const isPendingEdit = enrollment?.status === 'pending'
  return (
    <Form
      route={isPendingEdit ? 'courses.memberEnrollments.update' : 'courses.memberEnrollments.store'}
      routeParams={isPendingEdit ? { slug: course.slug, id: enrollment.id } : { slug: course.slug }}
      encType="multipart/form-data"
    >
      {({ processing }) => (
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Why do you want access?
            </label>
            <textarea
              id="reason"
              name="reason"
              required
              minLength={10}
              defaultValue={enrollment?.reason ?? ''}
              className="min-h-28 w-full rounded-xl border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="videoSource" className="text-sm font-medium">
                Video source
              </label>
              <select
                id="videoSource"
                name="videoSource"
                defaultValue={enrollment?.videoSource ?? 'url'}
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
              >
                <option value="url">HTTPS video URL</option>
                <option value="file">Upload video file</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="contextLinks" className="text-sm font-medium">
                Context link
              </label>
              <input
                id="contextLinks"
                name="contextLinks[]"
                type="url"
                placeholder="https://..."
                defaultValue={enrollment?.contextLinks?.[0] ?? ''}
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="videoUrl" className="text-sm font-medium">
                External video URL
              </label>
              <input
                id="videoUrl"
                name="videoUrl"
                type="url"
                placeholder="https://..."
                defaultValue={enrollment?.videoUrl ?? ''}
                className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="videoFile" className="text-sm font-medium">
                Upload video
              </label>
              <input
                id="videoFile"
                name="videoFile"
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="h-10 w-full rounded-xl border bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <Button type="submit" disabled={processing}>
            {isPendingEdit ? 'Update pending request' : 'Submit enrollment request'}
          </Button>
        </div>
      )}
    </Form>
  )
}

export default function CoursesShow({
  course,
  modules,
  access,
  enrollment,
  enrollmentSummary,
  user,
}: PageProps) {
  const isMemberGated = access.levelName === 'Member'
  const canApply = Boolean(user && isMemberGated && enrollmentSummary?.canApply && !access.allowed)

  return (
    <>
      <SEOHead
        title={course.pageTitle || course.name}
        description={course.metaDescription || course.description}
      />
      <div className="px-5 py-10">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-8">
            <section className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge>{access.levelName}</Badge>
                {access.allowed ? (
                  <Badge variant="secondary">Unlocked</Badge>
                ) : (
                  <Badge variant="secondary">Preview</Badge>
                )}
              </div>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{course.name}</h1>
              <p className="text-lg text-muted-foreground">{course.description}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Course outline</h2>
              {modules.map((module) => (
                <Card key={module.id}>
                  <CardHeader>
                    <CardTitle>{module.name}</CardTitle>
                    {module.notes ? <CardDescription>{module.notes}</CardDescription> : null}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2"
                      >
                        <span className="inline-flex items-center gap-2 text-sm font-medium">
                          <PlayCircle className="size-4 text-muted-foreground" />
                          {lesson.title}
                        </span>
                        {access.allowed ? (
                          <Link
                            route="lessons.show"
                            routeParams={{ slug: lesson.slug }}
                            className={buttonVariants({ size: 'sm', variant: 'outline' })}
                          >
                            Open
                          </Link>
                        ) : (
                          <Lock className="size-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </section>
          </main>

          <aside className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Enrollment status</CardTitle>
                <CardDescription>
                  {access.allowed
                    ? 'You can access this course.'
                    : 'Apply with a short note and video.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user ? (
                  <Link route="session.create" className={buttonVariants()}>
                    Sign in to apply
                  </Link>
                ) : enrollment ? (
                  <div className="space-y-2 rounded-xl border p-3 text-sm">
                    <p className="font-medium capitalize">{enrollment.status}</p>
                    {enrollment.rejectionReason ? (
                      <p className="text-muted-foreground">{enrollment.rejectionReason}</p>
                    ) : null}
                    {enrollmentSummary ? (
                      <p className="text-xs text-muted-foreground">
                        {enrollmentSummary.attemptsRemaining} of {enrollmentSummary.maxAttempts}{' '}
                        attempts remaining
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No enrollment request yet.</p>
                )}

                {canApply ? <EnrollmentForm course={course} enrollment={enrollment} /> : null}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  )
}

CoursesShow.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
