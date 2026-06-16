import { useState, useEffect } from 'react'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'
import type { InertiaProps } from '~/types'
import DashboardLayout from '~/layouts/dashboard'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { Button } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { cn } from '~/lib/utils'
import {
  BookOpen,
  Flame,
  Clock,
  Trophy,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  FileText,
  MessageSquare,
  StickyNote,
  Trash2,
} from 'lucide-react'
import React from 'react'

const stats = [
  { icon: BookOpen, value: '3', label: 'Courses Enrolled', color: 'text-primary' },
  { icon: CheckCircle2, value: '12', label: 'Lessons Done', color: 'text-secondary' },
  { icon: Clock, value: '8.5', label: 'Hours Learned', color: 'text-warm-600' },
  { icon: Flame, value: '5', label: 'Day Streak', color: 'text-orange-500' },
]

const continueLearning = [
  {
    title: 'Hotel Management Fundamentals',
    slug: 'hotel-management-fundamentals',
    progress: 65,
    type: 'Series',
    icon: BookOpen,
    topic: 'Hotel Management',
  },
  {
    title: 'Spoken English for Hospitality',
    slug: 'spoken-english-for-hospitality',
    progress: 30,
    type: 'Series',
    icon: BookOpen,
    topic: 'Spoken English',
  },
  {
    title: 'Front Desk Operations',
    slug: 'front-desk-operations',
    progress: 80,
    type: 'Lesson',
    icon: PlayCircle,
    topic: 'Front Office',
  },
]

const quickLinks = [
  { href: '/series', label: 'Browse Series', icon: BookOpen },
  { href: '/lessons', label: 'All Lessons', icon: PlayCircle },
  { href: '/forum', label: 'Community Forum', icon: MessageSquare },
  { href: '/blog', label: 'Read Blog', icon: FileText },
]

export default function Dashboard() {
  const { user } = usePage<Data.SharedProps>().props
  const [notes, setNotes] = useState<string[]>([])
  const [noteInput, setNoteInput] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('swanirvarbharat_notes')
    if (saved) setNotes(JSON.parse(saved))
  }, [])

  const addNote = () => {
    if (!noteInput.trim()) return
    const updated = [...notes, noteInput.trim()]
    setNotes(updated)
    localStorage.setItem('swanirvarbharat_notes', JSON.stringify(updated))
    setNoteInput('')
  }

  const removeNote = (index: number) => {
    const updated = notes.filter((_, i) => i !== index)
    setNotes(updated)
    localStorage.setItem('swanirvarbharat_notes', JSON.stringify(updated))
  }

  const userName = user?.username || 'Learner'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <>
      <header className="flex h-15 shrink-0 items-center gap-2 border-b px-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <span className="text-sm font-medium">Dashboard</span>
      </header>
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Welcome Header */}
          <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground sm:size-16 sm:text-2xl">
                {userInitial}
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Welcome back, {userName}!
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Continue your hospitality learning journey.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((s) => (
              <Card key={s.label} className="transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardPanel className="flex flex-col items-center gap-2 py-5 text-center">
                  <s.icon className={cn('size-7', s.color)} />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardPanel>
              </Card>
            ))}
          </div>

          {/* Main Grid: Continue Learning + Notes */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Continue Learning */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Continue Learning</h2>
                <Button variant="ghost" size="sm" render={<Link href="/series" />}>
                  View All <ArrowRight className="ml-1 size-3.5" />
                </Button>
              </div>
              <div className="space-y-3">
                {continueLearning.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/${item.type === 'Series' ? 'series' : 'lessons'}/${item.slug}`}
                    className="block"
                  >
                    <Card className="transition-all hover:shadow-md hover:-translate-y-0.5">
                      <CardPanel className="flex items-center gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <item.icon className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium text-sm">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.topic}</p>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold">{item.progress}%</p>
                          <p className="text-[10px] text-muted-foreground">{item.type}</p>
                        </div>
                      </CardPanel>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Personal Notes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">
                <StickyNote className="mr-1.5 inline size-4.5 text-muted-foreground" />
                Quick Notes
              </h2>
              <Card>
                <CardPanel className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addNote()}
                      placeholder="Write a note..."
                      className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring"
                    />
                    <Button size="sm" onClick={addNote} disabled={!noteInput.trim()}>
                      Add
                    </Button>
                  </div>
                  {notes.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No notes yet. Start jotting down ideas!
                    </p>
                  ) : (
                    <ul className="space-y-1 max-h-64 overflow-y-auto">
                      {notes.map((note, i) => (
                        <li
                          key={i}
                          className="group flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted/50 transition-colors"
                        >
                          <span className="flex-1 break-words">{note}</span>
                          <button
                            onClick={() => removeNote(i)}
                            className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                            aria-label="Delete note"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardPanel>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {quickLinks.map((link) => (
                <Link key={link.label} href={link.href} className="block">
                  <Card className="transition-all hover:shadow-md hover:-translate-y-0.5 h-full">
                    <CardPanel className="flex flex-col items-center gap-3 py-6 text-center">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <link.icon className="size-5" />
                      </div>
                      <p className="text-sm font-medium">{link.label}</p>
                    </CardPanel>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

Dashboard.layout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>
