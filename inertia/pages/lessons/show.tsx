import { Link } from '@adonisjs/inertia/react'
import type { Data } from '@generated/data'
import { router } from '@inertiajs/react'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Lock,
  PlayCircle,
  Star,
  Trophy,
} from 'lucide-react'
import React from 'react'

import { urlFor } from '~/client'
import ScrollReveal from '~/components/scroll_reveal'
import { SEOHead } from '~/components/seo_head'
import { Badge } from '~/components/ui/badge'
import { Button, buttonVariants } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Separator } from '~/components/ui/separator'
import DefaultLayout from '~/layouts/default'
import type { InertiaProps } from '~/types'

type RouteName = Parameters<typeof urlFor>[0]

type LessonPanel = 'overview' | 'transcript' | 'notes'

type LessonPost = Data.Post & {
  hasVideo?: boolean
  watchMinutes?: string
  videoYouTubeId?: string | null
  videoDriveId?: string | null
  videoEmbedUrl?: string | null
  authors?: Data.User[]
  taxonomies?: Data.Taxonomy[]
}

type LessonAccess = {
  allowed: boolean
  levelName: string
  reason?: string | null
}

type PageProps = InertiaProps<{
  lesson: LessonPost
  progress: Data.Progress | null
  isInWatchlist: boolean
  access: LessonAccess
  preferences: {
    autoplayNext: boolean
    defaultPanel: LessonPanel
  }
  accessLevels: Record<string, string>
}>

function stripHtml(input?: string | null) {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function boundedPercent(value?: number | null) {
  if (!value) return 0
  return Math.max(0, Math.min(100, Math.round(value)))
}

export default function LessonsShow({
  lesson,
  progress,
  isInWatchlist,
  access,
  preferences,
  user,
}: PageProps) {
  const body = lesson.body || ''
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const [activePanel, setActivePanel] = React.useState<LessonPanel>(preferences.defaultPanel)
  const authors = lesson.authors ?? []
  const topics = lesson.taxonomies ?? []
  const readPercent = boundedPercent(progress?.readPercent)
  const watchPercent = boundedPercent(progress?.watchPercent)
  const completionPercent = Math.max(readPercent, watchPercent, progress?.isCompleted ? 100 : 0)
  const isVideoLesson = Boolean(
    lesson.hasVideo ||
    lesson.videoYouTubeId ||
    lesson.videoDriveId ||
    lesson.videoUrl ||
    lesson.videoBunnyId
  )
  const primaryAuthor = authors[0]?.username

  React.useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    el.replaceChildren()
    if (!body || !access.allowed) return
    const doc = new DOMParser().parseFromString(body, 'text/html')
    el.append(...Array.from(doc.body.childNodes))
  }, [body, access.allowed])

  const patch = (route: RouteName, params: Record<string, string> = {}) => {
    router.patch(urlFor(route, params), {}, { preserveScroll: true, preserveState: true })
  }

  const markProgress = (isVideoLesson ? 'watchPercent' : 'readPercent') as
    | 'watchPercent'
    | 'readPercent'

  const markComplete = () => {
    router.post(
      urlFor('progress.store'),
      { postId: lesson.id, [markProgress]: 100, watchSeconds: lesson.videoSeconds ?? 0 },
      { preserveScroll: true, preserveState: true }
    )
  }

  const changePanel = (panel: LessonPanel) => {
    setActivePanel(panel)
    router.patch(
      urlFor('lessons.setDefaultPanel'),
      { panel },
      { preserveScroll: true, preserveState: true }
    )
  }

  return (
    <>
      <SEOHead
        title={lesson.pageTitle || lesson.title}
        description={lesson.description || undefined}
        type="article"
        publishedTime={lesson.publishedAt || undefined}
        author={primaryAuthor || undefined}
      />
      <div className="px-5 py-10">
        <div className="container mx-auto grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <ScrollReveal>
            <div className="space-y-8">
              <div className="flex items-center justify-between gap-4">
                <Link
                  route="lessons.index"
                  className={buttonVariants({ size: 'sm', variant: 'outline' })}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Back to lessons
                </Link>
                <Badge variant={access.allowed ? 'outline' : 'secondary'}>
                  {access.allowed ? access.levelName : `${access.levelName} required`}
                </Badge>
              </div>

              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {lesson.publishedAtDisplay ? <span>{lesson.publishedAtDisplay}</span> : null}
                  <span className="inline-flex items-center gap-1.5">
                    {isVideoLesson ? (
                      <PlayCircle className="size-4" />
                    ) : (
                      <BookOpen className="size-4" />
                    )}
                    {isVideoLesson ? 'Video lesson' : 'Article lesson'}
                  </span>
                  {lesson.watchMinutes || lesson.readMinutesDisplay ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 className="size-4" />
                      {lesson.watchMinutes || `${lesson.readMinutesDisplay} min read`}
                    </span>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {lesson.title}
                  </h1>
                  {lesson.description ? (
                    <p className="max-w-3xl text-lg text-muted-foreground">{lesson.description}</p>
                  ) : null}
                </div>
              </header>

              {isVideoLesson ? (
                <div className="overflow-hidden rounded-2xl border bg-black shadow-sm">
                  {access.allowed && lesson.videoYouTubeId ? (
                    <iframe
                      title={lesson.title}
                      src={`https://www.youtube.com/embed/${lesson.videoYouTubeId}`}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : access.allowed && lesson.videoDriveId ? (
                    <iframe
                      title={lesson.title}
                      src={`https://drive.google.com/file/d/${lesson.videoDriveId}/preview`}
                      className="aspect-video w-full"
                      allow="autoplay"
                      allowFullScreen
                    />
                  ) : access.allowed && lesson.videoUrl ? (
                    <video src={lesson.videoUrl} controls className="aspect-video w-full" />
                  ) : (
                    <div className="flex aspect-video flex-col items-center justify-center gap-3 p-8 text-center text-white">
                      <Lock className="size-10 opacity-80" />
                      <div>
                        <p className="text-lg font-medium">This lesson is locked</p>
                        <p className="text-sm text-white/70">
                          {access.reason || 'Sign in to continue.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {!access.allowed ? (
                <Card className="border-primary/30 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="size-5" />
                      Access required
                    </CardTitle>
                    <CardDescription>
                      {access.reason || 'Sign in to access this lesson.'}
                    </CardDescription>
                  </CardHeader>
                  <CardPanel>
                    {!user ? (
                      <Link
                        route="session.create"
                        className={buttonVariants({ variant: 'default' })}
                      >
                        Sign in
                      </Link>
                    ) : null}
                  </CardPanel>
                </Card>
              ) : null}

              <section className="space-y-4">
                <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border bg-muted/40 p-1">
                  {(
                    [
                      ['overview', 'Overview'],
                      ['transcript', 'Transcript'],
                      ['notes', 'Notes'],
                    ] as const
                  ).map(([panel, label]) => (
                    <Button
                      key={panel}
                      size="sm"
                      variant={activePanel === panel ? 'default' : 'ghost'}
                      onClick={() => changePanel(panel)}
                      className="h-8 rounded-lg px-3 text-sm"
                    >
                      {label}
                    </Button>
                  ))}
                </div>

                {activePanel === 'overview' ? (
                  <article className="space-y-6 rounded-2xl border bg-card p-6">
                    {access.allowed ? (
                      lesson.body ? (
                        <div
                          ref={bodyRef}
                          className="space-y-4 text-base leading-7 text-foreground"
                        />
                      ) : (
                        <p>
                          {stripHtml(lesson.description) ||
                            'No written lesson notes available yet.'}
                        </p>
                      )
                    ) : (
                      <p className="text-muted-foreground">
                        Unlock the lesson to read the full walkthrough.
                      </p>
                    )}
                  </article>
                ) : null}

                {activePanel === 'transcript' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Transcript</CardTitle>
                      <CardDescription>
                        Transcript support is wired into the lesson panel and ready for transcript
                        data.
                      </CardDescription>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm text-muted-foreground">
                        No transcript has been added for this lesson yet.
                      </p>
                    </CardPanel>
                  </Card>
                ) : null}

                {activePanel === 'notes' ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                      <CardDescription>
                        Personal notes are part of the Swanirvarbharat parity roadmap and will
                        attach here.
                      </CardDescription>
                    </CardHeader>
                    <CardPanel>
                      <p className="text-sm text-muted-foreground">
                        Notes CRUD is not enabled in this slice yet.
                      </p>
                    </CardPanel>
                  </Card>
                ) : null}
              </section>
            </div>
          </ScrollReveal>

          <aside className="space-y-6 lg:sticky lg:top-6">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Lesson progress</CardTitle>
                <CardDescription>Track completion and save this lesson.</CardDescription>
              </CardHeader>
              <CardPanel className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">{completionPercent}%</span>
                  </div>
                  <Progress value={completionPercent} />
                </div>
                <div className="grid gap-2">
                  <Button onClick={markComplete} disabled={!user || !access.allowed}>
                    <CheckCircle2 className="size-4" />
                    Mark complete
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => patch('progress.toggle')}
                    disabled={!user || !progress || !access.allowed}
                  >
                    Toggle completion
                  </Button>
                  <Button
                    variant={isInWatchlist ? 'secondary' : 'outline'}
                    onClick={() => patch('lessons.watchlist', { slug: lesson.slug })}
                    disabled={!user}
                  >
                    <Star className="size-4" />
                    {isInWatchlist ? 'In watchlist' : 'Add to watchlist'}
                  </Button>
                  <Button
                    variant={preferences.autoplayNext ? 'secondary' : 'outline'}
                    onClick={() => patch('lessons.autoplay', { slug: lesson.slug })}
                  >
                    Autoplay {preferences.autoplayNext ? 'on' : 'off'}
                  </Button>
                </div>
                {!user ? (
                  <p className="text-xs text-muted-foreground">
                    Sign in to save progress and manage your watchlist.
                  </p>
                ) : null}
              </CardPanel>
            </Card>

            <Card>
              <CardHeader className="border-b">
                <CardTitle>About this lesson</CardTitle>
                <CardDescription>Author, access, and topic metadata.</CardDescription>
              </CardHeader>
              <CardPanel className="space-y-5">
                <section className="space-y-2">
                  <p className="text-sm font-medium">Access</p>
                  <Badge variant="secondary">{access.levelName}</Badge>
                </section>
                <Separator />
                <section className="space-y-2">
                  <p className="text-sm font-medium">Author</p>
                  {authors.length ? (
                    authors.map((author) => (
                      <div key={author.id} className="rounded-lg border p-3">
                        <p className="font-medium">{author.username}</p>
                        <p className="text-sm text-muted-foreground">@{author.username}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Swanirvarbharat</p>
                  )}
                </section>
                <Separator />
                <section className="space-y-2">
                  <p className="text-sm font-medium">Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {topics.length ? (
                      topics.map((topic) => (
                        <Badge key={topic.id} variant="secondary">
                          {topic.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No topics assigned.</p>
                    )}
                  </div>
                </section>
              </CardPanel>
            </Card>
          </aside>
        </div>
      </div>

      {/* ── Assessment ──────────────────────────────────────── */}
      {isVideoLesson && access.allowed && (
        <AssessmentSection lessonSlug={lesson.slug || ''} lessonTitle={lesson.title} />
      )}
    </>
  )
}

function AssessmentSection({
  lessonSlug,
  lessonTitle,
}: {
  lessonSlug: string
  lessonTitle: string
}) {
  const [assessment, setAssessment] = React.useState<any>(null)
  const [questions, setQuestions] = React.useState<any[]>([])
  const [result, setResult] = React.useState<any>(null)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [started, setStarted] = React.useState(false)

  const fetchAssessment = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/lessons/${lessonSlug}/assessment`)
      const data = await res.json()
      if (data.assessment) {
        setAssessment(data.assessment)
        setQuestions(data.questions || [])
        if (data.result) setResult(data.result)
      }
    } catch {}
    setLoading(false)
  }

  const handleStart = () => {
    fetchAssessment()
    setStarted(true)
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch(`/lessons/${lessonSlug}/assessment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': '',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      if (data.result) setResult(data.result)
    } catch {}
    setSubmitting(false)
  }

  if (!started) {
    return (
      <div className="mx-auto mt-16 max-w-2xl px-5">
        <Card className="border-primary/20">
          <CardHeader className="border-b text-center">
            <CardTitle>Lesson Assessment</CardTitle>
            <CardDescription>
              Test your understanding of this lesson with 5 quick questions.
            </CardDescription>
          </CardHeader>
          <CardPanel className="flex flex-col items-center gap-4 py-8 text-center">
            <CheckCircle2 className="size-12 text-primary" />
            <p className="text-muted-foreground">Complete the assessment to track your progress.</p>
            <Button size="lg" onClick={handleStart}>
              Start Assessment
            </Button>
          </CardPanel>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto mt-16 max-w-2xl px-5 text-center">
        <p className="text-muted-foreground">Loading assessment...</p>
      </div>
    )
  }

  if (!assessment) {
    return (
      <div className="mx-auto mt-16 max-w-2xl px-5 text-center">
        <p className="text-muted-foreground">No assessment available for this lesson yet.</p>
      </div>
    )
  }

  if (result && !result.details) {
    return (
      <div className="mx-auto mt-16 max-w-2xl px-5">
        <Card>
          <CardHeader className="border-b text-center">
            <CardTitle>Assessment Completed</CardTitle>
          </CardHeader>
          <CardPanel className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="size-10 text-primary" />
            </div>
            <p className="text-3xl font-bold">
              {result.score}/{result.total}
            </p>
            <p className="text-muted-foreground">
              {result.score === result.total
                ? 'Perfect score! Excellent work!'
                : result.score >= 3
                  ? 'Good job! You passed the assessment.'
                  : 'Keep reviewing the lesson and try again.'}
            </p>
          </CardPanel>
        </Card>
      </div>
    )
  }

  const allAnswered = questions.every((q: any) => answers[q.id])

  return (
    <div className="mx-auto mt-16 max-w-2xl px-5">
      <Card className="border-primary/20">
        <CardHeader className="border-b">
          <CardTitle>Assessment</CardTitle>
          <CardDescription>Answer all 5 questions to complete this lesson.</CardDescription>
        </CardHeader>
        <CardPanel className="space-y-6">
          {questions.map((q: any, idx: number) => (
            <div key={q.id} className="space-y-3 rounded-lg border p-4">
              <p className="font-medium text-sm">
                {idx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {[
                  { label: 'A', value: q.optionA },
                  { label: 'B', value: q.optionB },
                  { label: 'C', value: q.optionC },
                  { label: 'D', value: q.optionD },
                ]
                  .filter((o) => o.value)
                  .map((opt) => (
                    <label
                      key={opt.label}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition-colors ${
                        answers[q.id] === opt.label
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt.label}
                        checked={answers[q.id] === opt.label}
                        onChange={() => handleAnswer(q.id, opt.label)}
                        className="mt-0.5"
                      />
                      <span>
                        <span className="font-medium">{opt.label}.</span> {opt.value}
                      </span>
                    </label>
                  ))}
              </div>
            </div>
          ))}

          <Button
            className="w-full"
            size="lg"
            disabled={!allAnswered || submitting}
            onClick={handleSubmit}
          >
            {submitting ? 'Submitting...' : 'Submit Answers'}
          </Button>
        </CardPanel>
      </Card>
    </div>
  )
}

LessonsShow.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
