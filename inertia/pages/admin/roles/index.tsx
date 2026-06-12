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
import { RolesPrimaryButtons } from '~/features/admin/roles/components/roles_primary_buttons'
import RolesTableFilters from '~/features/admin/roles/components/roles_table_filters'
import { DataTable } from '~/components/data_table/data_table'
import { PaginatorMeta, useDataTable } from '~/hooks/use_data_table'
import { urlFor } from '~/client'
import { ColumnDef } from '@tanstack/react-table'
import { RolesDataTableRowActions } from '~/features/admin/roles/components/roles_row_actions'
import { DataTableColumnHeader } from '~/components/data_table/data_table_column_header'

type PageProps = InertiaProps<{
  q: string
  dateFrom: string
  dateTo: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  roles: { data: Data.Role[]; metadata: PaginatorMeta }
}>

export default function AdminRoles({
  q,
  dateFrom = '',
  dateTo = '',
  sortBy = 'name',
  sortOrder = 'asc',
  roles,
}: PageProps) {
  const [querySearch, setQuerySearch] = React.useState(q || '')
  const [dateFromState, setDateFrom] = React.useState(dateFrom || '')
  const [dateToState, setDateTo] = React.useState(dateTo || '')

  const buildParams = React.useCallback(
    (overrides: Record<string, any> = {}) => {
      const params: Record<string, any> = {
        q: querySearch.length > 0 ? querySearch : undefined,
        dateFrom: dateFromState || undefined,
        dateTo: dateToState || undefined,
        sortBy,
        sortOrder,
        page: 1,
        limit: roles.metadata.perPage,
        ...overrides,
      }
      return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
    },
    [querySearch, dateFromState, dateToState, sortBy, sortOrder, roles.metadata.perPage]
  )

  const remoteTableOptions = useDataTable({
    data: roles,
    visit: ({ page, perPage }) => {
      router.get(urlFor('admin.roles.index'), buildParams({ page, limit: perPage }), {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: ['roles', 'q', 'dateFrom', 'dateTo', 'sortBy', 'sortOrder'],
      })
    },
  })

  const handleSort = (newSortBy: string, newSortOrder: string) => {
    router.get(
      urlFor('admin.roles.index'),
      buildParams({ sortBy: newSortBy, sortOrder: newSortOrder }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: ['roles', 'q', 'dateFrom', 'dateTo', 'sortBy', 'sortOrder'],
      }
    )
  }

  const columns: ColumnDef<Data.Role>[] = [
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
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) =>
        row.original.description ? (
          <span className="max-w-50 truncate block">{row.original.description}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: 'Users',
      accessorKey: 'usersCount',
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.usersCount ?? 0}</span>
      ),
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
      id: 'actions',
      cell: RolesDataTableRowActions,
    },
  ]

  return (
    <>
      <Head title="Roles" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Roles</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading title="Roles" description="Manage user roles and permissions.">
          <RolesPrimaryButtons />
        </Heading>
        <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="space-y-4">
            <RolesTableFilters
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              dateFrom={dateFromState}
              setDateFrom={setDateFrom}
              dateTo={dateToState}
              setDateTo={setDateTo}
              limit={roles.metadata.perPage}
            />
            <DataTable
              columns={columns}
              data={roles.data}
              remoteTableOptions={remoteTableOptions}
            />
          </div>
        </div>
      </Main>
    </>
  )
}

AdminRoles.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
