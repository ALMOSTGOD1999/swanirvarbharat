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
import { CommentsDataTableRowActions } from '~/features/admin/comments/components/comments_row_actions'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Link } from '@adonisjs/inertia/react'

type PageProps = InertiaProps<{
  q: string
  postId: string | undefined
  comments: { data: Data.Comment[]; metadata: PaginatorMeta }
}>

export default function AdminComments({ q, comments }: PageProps) {
  const [querySearch, setQuerySearch] = React.useState(q || '')

  const remoteTableOptions = useDataTable({
    data: comments,
    visit: ({ page, perPage }) => {
      router.get(
        urlFor('admin.comments.index'),
        {
          q: querySearch.length > 0 ? querySearch : undefined,
          page,
          limit: perPage,
        },
        {
          preserveScroll: true,
          preserveState: true,
          replace: true,
          only: ['comments', 'q'],
        }
      )
    },
  })

  const columns: ColumnDef<Data.Comment>[] = [
    {
      header: 'Body',
      accessorKey: 'body',
      cell: ({ row }) => {
        const body = row.original.body || ''
        return (
          <span className="truncate max-w-[300px] block">
            {body.length > 80 ? `${body.substring(0, 80)}...` : body}
          </span>
        )
      },
    },
    {
      header: 'Author',
      accessorKey: 'userId',
      cell: ({ row }) => <span>{row.original.user?.username ?? row.original.name ?? '—'}</span>,
    },
    {
      header: 'Post',
      accessorKey: 'postId',
      cell: ({ row }) =>
        row.original.post ? (
          <Link
            route="admin.posts.edit"
            routeParams={{ id: row.original.post.id }}
            className="text-primary hover:underline"
          >
            {row.original.post.title}
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: 'Created',
      accessorKey: 'createdAt',
      cell: ({ row }) =>
        row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : '—',
    },
    {
      header: 'State',
      accessorKey: 'stateId',
      cell: ({ row }) => {
        const stateId = row.original.stateId
        if (stateId === 6) {
          return <Badge variant="secondary">Archived</Badge>
        }
        return <Badge variant="outline">Public</Badge>
      },
    },
    {
      id: 'actions',
      cell: CommentsDataTableRowActions,
    },
  ]

  return (
    <>
      <Head title="Comments" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Comments</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading title="Comments" description="Manage comments across all posts." />
        <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Input
                placeholder="Search comments..."
                value={querySearch}
                onChange={(e) => setQuerySearch(e.target.value)}
                className="max-w-sm"
                aria-label="Search comments"
              />
            </div>
            <DataTable
              columns={columns}
              data={comments.data}
              remoteTableOptions={remoteTableOptions}
            />
          </div>
        </div>
      </Main>
    </>
  )
}

AdminComments.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
