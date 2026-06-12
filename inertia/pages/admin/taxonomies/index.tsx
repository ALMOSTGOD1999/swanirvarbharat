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
import { TaxonomiesPrimaryButtons } from '~/features/admin/taxonomies/components/taxonomies_primary_buttons'
import TaxonomiesTableFilters from '~/features/admin/taxonomies/components/taxonomies_table_filters'
import { DataTable } from '~/components/data_table/data_table'
import { PaginatorMeta, useDataTable } from '~/hooks/use_data_table'
import { urlFor } from '~/client'
import { ColumnDef } from '@tanstack/react-table'
import { TaxonomiesDataTableRowActions } from '~/features/admin/taxonomies/components/taxonomies_row_actions'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { CornerLeftDownIcon } from 'lucide-react'
import { DataTableColumnHeader } from '~/components/data_table/data_table_column_header'

type PageProps = InertiaProps<{
  q: string
  types: string[]
  isFeatured: boolean | undefined
  ownerIds: string[]
  dateFrom: string
  dateTo: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  allOwners: FilterOption[]
  taxonomies: { data: Data.Taxonomy[]; metadata: PaginatorMeta }
}>

export default function AdminTaxonomies({
  q,
  types = [],
  isFeatured,
  ownerIds = [],
  dateFrom = '',
  dateTo = '',
  sortBy = 'name',
  sortOrder = 'asc',
  allOwners = [],
  taxonomies,
}: PageProps) {
  const [querySearch, setQuerySearch] = React.useState(q || '')
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(types || [])
  const [selectedFeatured, setSelectedFeatured] = React.useState<string[]>(
    isFeatured !== undefined ? [String(isFeatured)] : []
  )
  const [selectedOwnerIds, setSelectedOwnerIds] = React.useState<string[]>(ownerIds || [])
  const [dateFromState, setDateFrom] = React.useState(dateFrom || '')
  const [dateToState, setDateTo] = React.useState(dateTo || '')

  const buildParams = React.useCallback(
    (overrides: Record<string, any> = {}) => {
      const params: Record<string, any> = {
        q: querySearch.length > 0 ? querySearch : undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        isFeatured: selectedFeatured.length === 1 ? selectedFeatured[0] === 'true' : undefined,
        ownerIds: selectedOwnerIds.length > 0 ? selectedOwnerIds : undefined,
        dateFrom: dateFromState || undefined,
        dateTo: dateToState || undefined,
        sortBy,
        sortOrder,
        page: 1,
        limit: taxonomies.metadata.perPage,
        ...overrides,
      }
      return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
    },
    [
      querySearch,
      selectedTypes,
      selectedFeatured,
      selectedOwnerIds,
      dateFromState,
      dateToState,
      sortBy,
      sortOrder,
      taxonomies.metadata.perPage,
    ]
  )

  const remoteTableOptions = useDataTable({
    data: taxonomies,
    visit: ({ page, perPage }) => {
      router.get(
        urlFor('admin.taxonomies.index'),
        {
          ...buildParams({ page, limit: perPage }),
        },
        {
          preserveScroll: true,
          preserveState: true,
          replace: true,
          only: [
            'taxonomies',
            'q',
            'types',
            'isFeatured',
            'ownerIds',
            'dateFrom',
            'dateTo',
            'sortBy',
            'sortOrder',
            'allOwners',
          ],
        }
      )
    },
  })

  const handleSort = (newSortBy: string, newSortOrder: string) => {
    router.get(
      urlFor('admin.taxonomies.index'),
      buildParams({ sortBy: newSortBy, sortOrder: newSortOrder }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: [
          'taxonomies',
          'q',
          'types',
          'isFeatured',
          'ownerIds',
          'dateFrom',
          'dateTo',
          'sortBy',
          'sortOrder',
          'allOwners',
        ],
      }
    )
  }

  const columns: ColumnDef<Data.Taxonomy>[] = [
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
        <div className="flex flex-col">
          <span className="font-medium">
            {row.original.name || (
              <span className="text-muted-foreground italic">Not provided</span>
            )}
          </span>
          <span className="text-xs text-muted-foreground">{row.original.slug}</span>
        </div>
      ),
    },
    {
      header: 'Parent',
      accessorKey: 'parentId',
      cell: ({ row }) =>
        row.original.parent ? (
          <span className="text-sm">{row.original.parent.name}</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {row.original.type}
        </Badge>
      ),
    },
    {
      header: 'Posts',
      accessorKey: 'postsCount',
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.postsCount ?? 0}</span>
      ),
    },
    {
      header: 'Children',
      accessorKey: 'childrenCount',
      cell: ({ row }) => {
        const count = row.original.childrenCount ?? 0
        if (count === 0) return <span className="text-xs text-muted-foreground">—</span>
        return (
          <Button
            variant="ghost"
            size="sm"
            render={<Link route="admin.taxonomies.index" />}
            className="h-7 gap-1 text-xs"
          >
            <CornerLeftDownIcon className="size-3" />
            {count} {count === 1 ? 'child' : 'children'}
          </Button>
        )
      },
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: ({ row }) =>
        row.original.description ? (
          <span className="max-w-50 truncate block text-sm">{row.original.description}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      header: 'Featured',
      accessorKey: 'isFeatured',
      cell: ({ row }) => (row.original.isFeatured ? 'Yes' : 'No'),
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
      cell: TaxonomiesDataTableRowActions,
    },
  ]

  return (
    <>
      <Head title="Taxonomies" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Taxonomies</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading title="Taxonomies" description="Manage your content and discussion taxonomies.">
          <TaxonomiesPrimaryButtons />
        </Heading>
        <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="space-y-4">
            <TaxonomiesTableFilters
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              selectedFeatured={selectedFeatured}
              setSelectedFeatured={setSelectedFeatured}
              selectedOwnerIds={selectedOwnerIds}
              setSelectedOwnerIds={setSelectedOwnerIds}
              dateFrom={dateFromState}
              setDateFrom={setDateFrom}
              dateTo={dateToState}
              setDateTo={setDateTo}
              allOwners={allOwners}
              limit={taxonomies.metadata.perPage}
            />
            <DataTable
              columns={columns}
              data={taxonomies.data}
              remoteTableOptions={remoteTableOptions}
            />
          </div>
        </div>
      </Main>
    </>
  )
}

AdminTaxonomies.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
