import type { InertiaProps, FilterOption } from '~/types'
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
import { UsersDataTableRowActions } from '~/features/admin/users/components/users_row_actions'
import UsersTableFilters from '~/features/admin/users/components/users_table_filters'
import { Badge } from '~/components/ui/badge'
import { DataTableColumnHeader } from '~/components/data_table/data_table_column_header'

type PageProps = InertiaProps<{
  q: string
  roleIds: string[]
  emailVerified: boolean | undefined
  dateFrom: string
  dateTo: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  allRoles: FilterOption[]
  users: { data: Data.User[]; metadata: PaginatorMeta }
}>

export default function AdminUsers({
  q,
  roleIds = [],
  emailVerified,
  dateFrom = '',
  dateTo = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  allRoles = [],
  users,
}: PageProps) {
  const [querySearch, setQuerySearch] = React.useState(q || '')
  const [selectedRoleIds, setSelectedRoleIds] = React.useState<string[]>(roleIds || [])
  const [selectedVerified, setSelectedVerified] = React.useState<string[]>(
    emailVerified !== undefined ? [String(emailVerified)] : []
  )
  const [dateFromState, setDateFrom] = React.useState(dateFrom || '')
  const [dateToState, setDateTo] = React.useState(dateTo || '')

  const buildParams = React.useCallback(
    (overrides: Record<string, any> = {}) => {
      const params: Record<string, any> = {
        q: querySearch.length > 0 ? querySearch : undefined,
        roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
        emailVerified: selectedVerified.length === 1 ? selectedVerified[0] === 'true' : undefined,
        dateFrom: dateFromState || undefined,
        dateTo: dateToState || undefined,
        sortBy,
        sortOrder,
        page: 1,
        limit: users.metadata.perPage,
        ...overrides,
      }
      return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
    },
    [
      querySearch,
      selectedRoleIds,
      selectedVerified,
      dateFromState,
      dateToState,
      sortBy,
      sortOrder,
      users.metadata.perPage,
    ]
  )

  const remoteTableOptions = useDataTable({
    data: users,
    visit: ({ page, perPage }) => {
      router.get(urlFor('admin.users.index'), buildParams({ page, limit: perPage }), {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: [
          'users',
          'q',
          'roleIds',
          'emailVerified',
          'dateFrom',
          'dateTo',
          'sortBy',
          'sortOrder',
          'allRoles',
        ],
      })
    },
  })

  const handleSort = (newSortBy: string, newSortOrder: string) => {
    router.get(
      urlFor('admin.users.index'),
      buildParams({ sortBy: newSortBy, sortOrder: newSortOrder }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: [
          'users',
          'q',
          'roleIds',
          'emailVerified',
          'dateFrom',
          'dateTo',
          'sortBy',
          'sortOrder',
          'allRoles',
        ],
      }
    )
  }

  const columns: ColumnDef<Data.User>[] = [
    {
      header: () => (
        <DataTableColumnHeader
          title="Username"
          sortByField="username"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={handleSort}
        />
      ),
      accessorKey: 'username',
      cell: ({ row }) => <span className="font-medium">{row.original.username}</span>,
    },
    {
      header: () => (
        <DataTableColumnHeader
          title="Email"
          sortByField="email"
          currentSortBy={sortBy}
          currentSortOrder={sortOrder}
          onSort={handleSort}
        />
      ),
      accessorKey: 'email',
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <span className="truncate">{row.original.email}</span>
          {row.original.emailVerifiedAt && (
            <Badge variant="outline" className="text-xs text-green-600">
              Verified
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: 'Role',
      accessorKey: 'roleId',
      cell: ({ row }) => <Badge variant="secondary">{row.original.roleId}</Badge>,
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
      cell: UsersDataTableRowActions,
    },
  ]

  return (
    <>
      <Head title="Users" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading title="Users" description="Manage user accounts and roles." />
        <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="space-y-4">
            <UsersTableFilters
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              selectedRoleIds={selectedRoleIds}
              setSelectedRoleIds={setSelectedRoleIds}
              selectedVerified={selectedVerified}
              setSelectedVerified={setSelectedVerified}
              dateFrom={dateFromState}
              setDateFrom={setDateFrom}
              dateTo={dateToState}
              setDateTo={setDateTo}
              allRoles={allRoles}
              limit={users.metadata.perPage}
            />
            <DataTable
              columns={columns}
              data={users.data}
              remoteTableOptions={remoteTableOptions}
            />
          </div>
        </div>
      </Main>
    </>
  )
}

AdminUsers.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
