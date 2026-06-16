import { useState, useEffect } from 'react'
import { Link } from '@adonisjs/inertia/react'
import type React from 'react'
import DefaultLayout from '~/layouts/default'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { ArrowRight, Trophy, BookOpen } from 'lucide-react'

export default function MyProgress() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/assessments/history')
      .then((r) => r.json())
      .then((data) => {
        if (data.results) setResults(data.results)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">My Progress</h1>
      <p className="text-muted-foreground mb-8">View your completed lesson assessments and scores.</p>

      {loading ? (
        <p className="text-center text-muted-foreground py-10">Loading...</p>
      ) : results.length === 0 ? (
        <Card>
          <CardPanel className="flex flex-col items-center gap-4 py-16 text-center">
            <Trophy className="size-12 text-muted-foreground/40" />
            <p className="text-lg font-medium">No assessments completed yet</p>
            <p className="text-sm text-muted-foreground">Complete a lesson assessment to track your progress.</p>
            <Button render={<Link href="/lessons" />}>
              Browse Lessons <ArrowRight className="ml-1 size-4" />
            </Button>
          </CardPanel>
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((r) => (
            <Link key={r.id} href={`/lessons/${r.lessonSlug}`} className="block">
              <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardPanel className="flex items-center gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BookOpen className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm">{r.lessonTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.completedAt ? new Date(r.completedAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold">{r.score}/{r.total}</p>
                    <Badge variant={r.score >= 3 ? 'default' : 'secondary'} className="text-[10px]">
                      {r.score >= 3 ? 'Passed' : 'Failed'}
                    </Badge>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                </CardPanel>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

MyProgress.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
