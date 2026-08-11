import type React from 'react'
import AdminLayout from '~/layouts/admin'
import type { InertiaProps } from '~/types'
import { Head } from '@inertiajs/react'
import { Header } from '~/components/header'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb'
import { Main } from '~/components/main'
import { Card, CardHeader, CardTitle, CardPanel } from '~/components/ui/card'
import {
  UsersIcon,
  FileTextIcon,
  ListIcon,
  TagsIcon,
  MessageSquareIcon,
  MessageCircleMoreIcon,
  CheckCircleIcon,
  ClockIcon,
} from 'lucide-react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/charts'
import { Area, AreaChart, XAxis } from 'recharts'

type MonthlyStat = {
  month: string
  total: number
}

type PageProps = InertiaProps<{
  counts: {
    users: { total: number; monthly: MonthlyStat[] }
    posts: { total: number; monthly: MonthlyStat[] }
    series: { total: number }
    taxonomies: { total: number }
    comments: { total: number }
    discussions: { total: number; monthly: MonthlyStat[] }
    completedLessons: { total: number; monthly: MonthlyStat[] }
    watchSeconds: { total: number; monthly: MonthlyStat[] }
  }
}>

const statCards = [
  { key: 'users', title: 'Users', icon: UsersIcon, color: '#6366f1' },
  { key: 'posts', title: 'Posts Published', icon: FileTextIcon, color: '#8b5cf6' },
  { key: 'series', title: 'Courses', icon: ListIcon, color: '#a855f7' },
  { key: 'taxonomies', title: 'Taxonomies', icon: TagsIcon, color: '#d946ef' },
  { key: 'comments', title: 'Comments', icon: MessageSquareIcon, color: '#ec4899' },
  { key: 'discussions', title: 'Discussions', icon: MessageCircleMoreIcon, color: '#f59e0b' },
  { key: 'completedLessons', title: 'Completed Lessons', icon: CheckCircleIcon, color: '#10b981' },
  { key: 'watchSeconds', title: 'Watch Hours', icon: ClockIcon, color: '#3b82f6' },
] as const

function MiniChart({
  data,
  color,
  dataKey = 'total',
}: {
  data: MonthlyStat[]
  color: string
  dataKey?: string
}) {
  const config: ChartConfig = {
    [dataKey]: { label: 'Count', color },
  }

  return (
    <ChartContainer config={config} className="h-[120px] w-full">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" hide />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideLabel
              hideIndicator
              formatter={(value) => [Number(value).toLocaleString(), 'Count']}
            />
          }
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          fill={`url(#fill-${dataKey})`}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export default function AdminDashboard({ counts }: PageProps) {
  const totals: Record<string, number> = {
    users: counts.users.total,
    posts: counts.posts.total,
    series: counts.series.total,
    taxonomies: counts.taxonomies.total,
    comments: counts.comments.total,
    discussions: counts.discussions.total,
    completedLessons: counts.completedLessons.total,
    watchSeconds: Math.round(counts.watchSeconds.total / 3600),
  }

  const monthlyData: Record<string, MonthlyStat[]> = {
    users: counts.users.monthly,
    posts: counts.posts.monthly,
    discussions: counts.discussions.monthly,
    completedLessons: counts.completedLessons.monthly,
    watchSeconds: counts.watchSeconds.monthly,
  }

  return (
    <>
      <Head title="Dashboard" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <div className="flex flex-col gap-6 py-4">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map(({ key, title, icon: Icon }) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-sm font-medium">
                    {title}
                    <Icon className="size-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardPanel>
                  <div className="text-2xl font-bold">
                    {key === 'watchSeconds'
                      ? `${totals[key].toLocaleString()}h`
                      : totals[key].toLocaleString()}
                  </div>
                </CardPanel>
              </Card>
            ))}
          </div>

          {/* Monthly Charts */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">New Users (Last 12 Months)</CardTitle>
              </CardHeader>
              <CardPanel>
                <MiniChart data={monthlyData.users} color="#6366f1" />
              </CardPanel>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Published Posts (Last 12 Months)
                </CardTitle>
              </CardHeader>
              <CardPanel>
                <MiniChart data={monthlyData.posts} color="#8b5cf6" />
              </CardPanel>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  New Discussions (Last 12 Months)
                </CardTitle>
              </CardHeader>
              <CardPanel>
                <MiniChart data={monthlyData.discussions} color="#f59e0b" />
              </CardPanel>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Completed Lessons (Last 12 Months)
                </CardTitle>
              </CardHeader>
              <CardPanel>
                <MiniChart data={monthlyData.completedLessons} color="#10b981" />
              </CardPanel>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Watch Hours (Last 12 Months)</CardTitle>
              </CardHeader>
              <CardPanel>
                <MiniChart data={monthlyData.watchSeconds} color="#3b82f6" />
              </CardPanel>
            </Card>
          </div>
        </div>
      </Main>
    </>
  )
}

AdminDashboard.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
