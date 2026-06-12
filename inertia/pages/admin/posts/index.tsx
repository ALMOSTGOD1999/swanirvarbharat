import type { Data } from '@generated/data'
import { Head, router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import type { ColumnDef } from '@tanstack/react-table'
import React from 'react'
import { urlFor } from '~/client'
import { DataTable } from '~/components/data_table/data_table'
import { DataTableColumnHeader } from '~/components/data_table/data_table_column_header'
import { Header } from '~/components/header'
import Heading from '~/components/heading'
import { Main } from '~/components/main'
import { Badge } from '~/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb'
import { PostsPrimaryButtons } from '~/features/admin/posts/components/posts_primary_buttons'
import PostsTableFilters from '~/features/admin/posts/components/posts_table_filters'
import { PostsDataTableRowActions } from '~/features/admin/posts/components/posts_row_actions'
import { type PaginatorMeta, useDataTable } from '~/hooks/use_data_table'
import AdminLayout from '~/layouts/admin'
import type { InertiaProps, FilterOption } from '~/types'

type PageProps = InertiaProps<{
  q: string
  types: Data.Post['postType'][]
  states: string[]
  authorIds: string[]
  taxonomyNames: string[]
  dateFrom: string
  dateTo: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  allAuthors: FilterOption[]
  posts: { data: Data.Post[]; metadata: PaginatorMeta }
}>

export default function AdminPosts({
  q,
  types = [],
  states = [],
  authorIds = [],
  taxonomyNames = [],
  dateFrom = '',
  dateTo = '',
  sortBy = 'publishedAt',
  sortOrder = 'desc',
  allAuthors = [],
  posts,
}: PageProps) {
  const [querySearch, setQuerySearch] = React.useState(q || '')
  const [selectedTypes, setSelectedTypes] = React.useState<Data.Post['postType'][]>(types || [])
  const [selectedStates, setSelectedStates] = React.useState<string[]>(states || [])
  const [selectedAuthorIds, setSelectedAuthorIds] = React.useState<string[]>(authorIds || [])
  const [selectedTaxonomyNames, setSelectedTaxonomyNames] = React.useState<string[]>(
    taxonomyNames || []
  )
  const [dateFromState, setDateFrom] = React.useState(dateFrom || '')
  const [dateToState, setDateTo] = React.useState(dateTo || '')

  const buildParams = React.useCallback(
    (overrides: Record<string, any> = {}) => {
      const params: Record<string, any> = {
        page: 1,
        limit: posts.metadata.perPage,
        ...overrides,
      }
      if (querySearch.length > 0) params.q = querySearch
      if (selectedTypes.length > 0) params.types = selectedTypes
      if (selectedStates.length > 0) params.states = selectedStates
      if (selectedAuthorIds.length > 0) params.authorIds = selectedAuthorIds
      if (selectedTaxonomyNames.length > 0) params.taxonomyNames = selectedTaxonomyNames
      if (dateFromState) params.dateFrom = dateFromState
      if (dateToState) params.dateTo = dateToState
      return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
    },
    [
      querySearch,
      selectedTypes,
      selectedStates,
      selectedAuthorIds,
      selectedTaxonomyNames,
      dateFromState,
      dateToState,
      posts.metadata.perPage,
    ]
  )

  const remoteTableOptions = useDataTable({
    data: posts,
    visit: ({ page, perPage }) => {
      const params = buildParams({ page, limit: perPage })
      params.sortBy = sortBy
      params.sortOrder = sortOrder

      router.get(urlFor('admin.posts.index'), params, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: [
          'posts',
          'q',
          'types',
          'states',
          'authorIds',
          'taxonomyNames',
          'dateFrom',
          'dateTo',
          'sortBy',
          'sortOrder',
        ],
      })
    },
  })

  /** Navigate with a new sort */
  const handleSort = React.useCallback(
    (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      const params = buildParams({ page: 1, limit: posts.metadata.perPage })
      params.sortBy = newSortBy
      params.sortOrder = newSortOrder
      router.get(urlFor('admin.posts.index'), params, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: [
          'posts',
          'q',
          'types',
          'states',
          'authorIds',
          'taxonomyNames',
          'dateFrom',
          'dateTo',
          'sortBy',
          'sortOrder',
        ],
      })
    },
    [buildParams, posts.metadata.perPage]
  )

  const columns: ColumnDef<Data.Post>[] = [
    {
      header: () => (
        <DataTableColumnHeader
          title="Post"
          sortByField="title"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={handleSort}
        />
      ),
      accessorKey: 'title',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.thumbnail?.url ? (
            <img
              src={row.original.thumbnail.url}
              alt={row.original.thumbnail.altText || ''}
              className="h-10 w-14 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-14 rounded bg-muted" />
          )}
          <div className="flex flex-col gap-0.5">
            <Link
              route="admin.posts.edit"
              routeParams={{ id: row.original.id }}
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              {row.original.title}
            </Link>
            {row.original.slug ? (
              <span className="text-muted-foreground text-xs">/{row.original.slug}</span>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'postType',
      cell: ({ row }) => <Badge variant="outline">{row.original.postType}</Badge>,
    },
    {
      header: 'State',
      accessorKey: 'state',
      cell: ({ row }) => {
        const state = row.original.state
        const variant =
          state === 'Public'
            ? 'default'
            : state === 'Draft'
              ? 'secondary'
              : state === 'Archived'
                ? 'destructive'
                : 'outline'
        return <Badge variant={variant}>{state}</Badge>
      },
    },
    {
      header: 'Taxonomies',
      id: 'taxonomies',
      cell: ({ row }) => {
        const taxonomies = row.original.taxonomies
        if (!taxonomies || taxonomies.length === 0)
          return <span className="text-muted-foreground">—</span>
        return (
          <div className="flex flex-wrap gap-1">
            {taxonomies.slice(0, 3).map((t) => (
              <Badge key={t.id} variant="secondary" className="text-xs">
                {t.name}
              </Badge>
            ))}
            {taxonomies.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{taxonomies.length - 3}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      header: () => (
        <DataTableColumnHeader
          title="Published"
          sortByField="publishedAt"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={handleSort}
        />
      ),
      accessorKey: 'publishedAt',
      cell: ({ row }) =>
        row.original.publishedAt ? new Date(row.original.publishedAt).toLocaleDateString() : '—',
    },
    {
      header: () => (
        <DataTableColumnHeader
          title="Updated"
          sortByField="updatedAt"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={handleSort}
        />
      ),
      accessorKey: 'updatedAt',
      cell: ({ row }) =>
        row.original.updatedAt ? new Date(row.original.updatedAt).toLocaleDateString() : '—',
    },
    {
      id: 'actions',
      cell: PostsDataTableRowActions,
    },
  ]

  return (
    <>
      <Head title="Posts" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Posts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading title="Posts" description="Manage your posts and its contents.">
          <PostsPrimaryButtons />
        </Heading>
        <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="space-y-4">
            <PostsTableFilters
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              selectedStates={selectedStates}
              setSelectedStates={setSelectedStates}
              selectedAuthorIds={selectedAuthorIds}
              setSelectedAuthorIds={setSelectedAuthorIds}
              selectedTaxonomyNames={selectedTaxonomyNames}
              setSelectedTaxonomyNames={setSelectedTaxonomyNames}
              dateFrom={dateFromState}
              setDateFrom={setDateFrom}
              dateTo={dateToState}
              setDateTo={setDateTo}
              allAuthors={allAuthors}
              limit={posts.metadata.perPage}
            />
            <DataTable
              columns={columns}
              data={posts.data}
              remoteTableOptions={remoteTableOptions}
            />
          </div>
        </div>
      </Main>
    </>
  )
}

AdminPosts.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
