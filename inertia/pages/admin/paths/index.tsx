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
import { PathPrimaryButtons } from '~/features/admin/paths/components/path_primary_buttons'
import PathTableFilters from '~/features/admin/paths/components/path_table_filters'
import { PathDataTableRowActions } from '~/features/admin/paths/components/path_row_actions'
import { type PaginatorMeta, useDataTable } from '~/hooks/use_data_table'
import AdminLayout from '~/layouts/admin'
import type { InertiaProps, FilterOption } from '~/types'

type PageProps = InertiaProps<{
  q: string
  states: string[]
  ownerIds: string[]
  dateFrom: string
  dateTo: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  allOwners: FilterOption[]
  paths: { data: Data.Path[]; metadata: PaginatorMeta }
}>

export default function AdminPaths({
  q,
  states = [],
  ownerIds = [],
  dateFrom = '',
  dateTo = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  allOwners = [],
  paths,
}: PageProps) {
  const [querySearch, setQuerySearch] = React.useState(q || '')
  const [selectedStates, setSelectedStates] = React.useState<string[]>(states || [])
  const [selectedOwnerIds, setSelectedOwnerIds] = React.useState<string[]>(ownerIds || [])
  const [dateFromState, setDateFrom] = React.useState(dateFrom || '')
  const [dateToState, setDateTo] = React.useState(dateTo || '')

  const buildParams = React.useCallback(
    (overrides: Record<string, any> = {}) => {
      const params: Record<string, any> = {
        page: 1,
        limit: paths.metadata.perPage,
        ...overrides,
      }
      if (querySearch.length > 0) params.q = querySearch
      if (selectedStates.length > 0) params.states = selectedStates
      if (selectedOwnerIds.length > 0) params.ownerIds = selectedOwnerIds
      if (dateFromState) params.dateFrom = dateFromState
      if (dateToState) params.dateTo = dateToState
      return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
    },
    [
      querySearch,
      selectedStates,
      selectedOwnerIds,
      dateFromState,
      dateToState,
      paths.metadata.perPage,
    ]
  )

  const remoteTableOptions = useDataTable({
    data: paths,
    visit: ({ page, perPage }) => {
      const params = buildParams({ page, limit: perPage })
      params.sortBy = sortBy
      params.sortOrder = sortOrder

      router.get(urlFor('admin.paths.index'), params, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: ['paths', 'q', 'states', 'ownerIds', 'dateFrom', 'dateTo', 'sortBy', 'sortOrder'],
      })
    },
  })

  const handleSort = React.useCallback(
    (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
      const params = buildParams({ page: 1, limit: paths.metadata.perPage })
      params.sortBy = newSortBy
      params.sortOrder = newSortOrder
      router.get(urlFor('admin.paths.index'), params, {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: ['paths', 'q', 'states', 'ownerIds', 'dateFrom', 'dateTo', 'sortBy', 'sortOrder'],
      })
    },
    [buildParams, paths.metadata.perPage]
  )

  const columns: ColumnDef<Data.Path>[] = [
    {
      header: () => (
        <DataTableColumnHeader
          title="Name"
          sortByField="name"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={handleSort}
        />
      ),
      accessorKey: 'name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          {row.original.asset?.url ? (
            <img
              src={row.original.asset.url}
              alt={row.original.asset.altText || ''}
              className="h-10 w-14 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-14 rounded bg-muted" />
          )}
          <div className="flex flex-col gap-0.5">
            <Link
              route="admin.paths.edit"
              routeParams={{ id: row.original.id }}
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              {row.original.name}
            </Link>
            {row.original.slug ? (
              <span className="text-muted-foreground text-xs">/{row.original.slug}</span>
            ) : null}
          </div>
        </div>
      ),
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
      header: 'Owner',
      accessorKey: 'owner',
      cell: ({ row }) => {
        const owner = row.original.owner
        if (!owner) return <span className="text-muted-foreground">—</span>
        return <span>{owner.username || owner.email}</span>
      },
    },
    {
      header: 'Courses',
      accessorKey: 'coursesCount',
      cell: ({ row }) => row.original.coursesCount ?? 0,
    },
    {
      header: () => (
        <DataTableColumnHeader
          title="Created"
          sortByField="createdAt"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={handleSort}
        />
      ),
      accessorKey: 'createdAt',
      cell: ({ row }) =>
        row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : '—',
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
      cell: PathDataTableRowActions,
    },
  ]

  return (
    <>
      <Head title="Paths" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Paths</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading title="Paths" description="Manage your learning paths and their courses.">
          <PathPrimaryButtons />
        </Heading>
        <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="space-y-4">
            <PathTableFilters
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              selectedStates={selectedStates}
              setSelectedStates={setSelectedStates}
              selectedOwnerIds={selectedOwnerIds}
              setSelectedOwnerIds={setSelectedOwnerIds}
              dateFrom={dateFromState}
              setDateFrom={setDateFrom}
              dateTo={dateToState}
              setDateTo={setDateTo}
              allOwners={allOwners}
              limit={paths.metadata.perPage}
            />
            <DataTable
              columns={columns}
              data={paths.data}
              remoteTableOptions={remoteTableOptions}
            />
          </div>
        </div>
      </Main>
    </>
  )
}

AdminPaths.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
