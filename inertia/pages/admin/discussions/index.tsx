import type { InertiaProps } from '~/types'
import type { Data } from '@generated/data'
import React from 'react'
import AdminLayout from '~/layouts/admin'
import { Head, router } from '@inertiajs/react'
import { Header } from '~/components/header'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb'
import { Main } from '~/components/main'
import Heading from '~/components/heading'
import { DataTable } from '~/components/data_table/data_table'
import { PaginatorMeta, useDataTable } from '~/hooks/use_data_table'
import { urlFor } from '~/client'
import { ColumnDef } from '@tanstack/react-table'
import { DiscussionsDataTableRowActions } from '~/features/admin/discussions/components/discussions_row_actions'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Link } from '@adonisjs/inertia/react'

type PageProps = InertiaProps<{
  q: string
  taxonomyId: string | undefined
  solved: string | undefined
  discussions: { data: Data.Discussion[]; metadata: PaginatorMeta }
}>

export default function AdminDiscussions({ q, discussions }: PageProps) {
  const [querySearch, setQuerySearch] = React.useState(q || '')

  const remoteTableOptions = useDataTable({
    data: discussions,
    visit: ({ page, perPage }) => {
      router.get(
        urlFor('admin.discussions.index'),
        {
          q: querySearch.length > 0 ? querySearch : undefined,
          page,
          limit: perPage,
        },
        {
          preserveScroll: true,
          preserveState: true,
          replace: true,
          only: ['discussions', 'q'],
        }
      )
    },
  })

  const columns: ColumnDef<Data.Discussion>[] = [
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => (
        <Link
          route="discussions.show"
          routeParams={{ slug: row.original.slug }}
          className="font-medium text-foreground transition-colors hover:text-primary"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      header: 'Author',
      accessorKey: 'userId',
      cell: ({ row }) => <span>{row.original.user?.username ?? '—'}</span>,
    },
    {
      header: 'Taxonomy',
      accessorKey: 'taxonomyId',
      cell: ({ row }) =>
        row.original.taxonomy ? (
          <Badge variant="secondary">{row.original.taxonomy.name}</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: 'Votes',
      accessorKey: 'votesCount',
      cell: ({ row }) => <span>{row.original.votesCount ?? 0}</span>,
    },
    {
      header: 'Comments',
      accessorKey: 'commentsCount',
      cell: ({ row }) => <span>{row.original.commentsCount ?? 0}</span>,
    },
    {
      header: 'Solved',
      accessorKey: 'solvedAt',
      cell: ({ row }) =>
        row.original.solvedAt ? (
          <Badge variant="default" className="bg-green-600">
            Solved
          </Badge>
        ) : (
          <Badge variant="outline">Unsolved</Badge>
        ),
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }) =>
        row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : '—',
    },
    {
      id: 'actions',
      cell: DiscussionsDataTableRowActions,
    },
  ]

  return (
    <>
      <Head title="Discussions" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Discussions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading title="Discussions" description="Manage community discussions." />
        <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search discussions..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="max-w-sm"
                aria-label="Search discussions"
              />
            </div>
            <DataTable
              columns={columns}
              data={discussions.data}
              remoteTableOptions={remoteTableOptions}
            />
          </div>
        </div>
      </Main>
    </>
  )
}

AdminDiscussions.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
