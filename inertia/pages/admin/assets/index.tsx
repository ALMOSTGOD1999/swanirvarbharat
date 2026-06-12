import type { InertiaProps } from '~/types'
import type { Data } from '@generated/data'
import React from 'react'
import AdminLayout from '~/layouts/admin'
import { Head, router, useForm } from '@inertiajs/react'
import { Header } from '~/components/header'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb'
import { Main } from '~/components/main'
import Heading from '~/components/heading'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '~/components/ui/dialog'
import { PlusIcon, UploadIcon, ImageIcon } from 'lucide-react'
import { PaginatorMeta, useDataTable } from '~/hooks/use_data_table'
import { DataTable } from '~/components/data_table/data_table'
import { ColumnDef } from '@tanstack/react-table'
import { urlFor } from '~/client'
import { AssetTypes } from '#enums/asset'
import AssetsTableFilters from '~/features/admin/assets/components/assets_table_filters'
import { AssetsDataTableRowActions } from '~/features/admin/assets/components/assets_row_actions'
import { DataTableColumnHeader } from '~/components/data_table/data_table_column_header'

type PageProps = InertiaProps<{
  q: string
  types: string[]
  dateFrom: string
  dateTo: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  assets: { data: Data.Asset[]; metadata: PaginatorMeta }
}>

export default function AdminAssets({
  q,
  types = [],
  dateFrom = '',
  dateTo = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
  assets,
}: PageProps) {
  const [querySearch, setQuerySearch] = React.useState(q || '')
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(types || [])
  const [dateFromState, setDateFrom] = React.useState(dateFrom || '')
  const [dateToState, setDateTo] = React.useState(dateTo || '')
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false)
  const [previewAsset, setPreviewAsset] = React.useState<{ url: string; altText?: string } | null>(
    null
  )

  const { data, setData, post, processing, reset } = useForm({
    file: null as File | null,
    type: AssetTypes.THUMBNAIL,
    altText: '',
    credit: '',
  })
  const [preview, setPreview] = React.useState<string | null>(null)

  const buildParams = React.useCallback(
    (overrides: Record<string, any> = {}) => {
      const params: Record<string, any> = {
        q: querySearch.length > 0 ? querySearch : undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        dateFrom: dateFromState || undefined,
        dateTo: dateToState || undefined,
        sortBy,
        sortOrder,
        page: 1,
        limit: assets.metadata.perPage,
        ...overrides,
      }
      return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
    },
    [
      querySearch,
      selectedTypes,
      dateFromState,
      dateToState,
      sortBy,
      sortOrder,
      assets.metadata.perPage,
    ]
  )

  const remoteTableOptions = useDataTable({
    data: assets,
    visit: ({ page, perPage }) => {
      router.get(urlFor('admin.assets.index'), buildParams({ page, limit: perPage }), {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: ['assets', 'q', 'types', 'dateFrom', 'dateTo', 'sortBy', 'sortOrder'],
      })
    },
  })

  const handleSort = (newSortBy: string, newSortOrder: string) => {
    router.get(
      urlFor('admin.assets.index'),
      buildParams({ sortBy: newSortBy, sortOrder: newSortOrder }),
      {
        preserveScroll: true,
        preserveState: true,
        replace: true,
        only: ['assets', 'q', 'types', 'dateFrom', 'dateTo', 'sortBy', 'sortOrder'],
      }
    )
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('file', file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpload = () => {
    if (!data.file) return
    post(urlFor('admin.assets.store'), {
      onSuccess: () => {
        reset()
        setPreview(null)
        setUploadDialogOpen(false)
      },
    })
  }

  const columns: ColumnDef<any>[] = [
    {
      header: 'Preview',
      accessorKey: 'url',
      cell: ({ row }) => (
        <button
          type="button"
          className="h-12 w-12 overflow-hidden rounded border bg-muted cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
          onClick={() =>
            row.original.url &&
            setPreviewAsset({ url: row.original.url, altText: row.original.altText })
          }
        >
          {row.original.url ? (
            <img
              src={row.original.url}
              alt={row.original.altText || ''}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </button>
      ),
    },
    {
      header: 'Type',
      accessorKey: 'type',
      cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge>,
    },
    {
      header: 'Alt Text',
      accessorKey: 'altText',
      cell: ({ row }) => (
        <span className="max-w-48 truncate block">{row.original.altText || '—'}</span>
      ),
    },
    {
      header: 'Credit',
      accessorKey: 'credit',
      cell: ({ row }) => (
        <span className="max-w-48 truncate block">{row.original.credit || '—'}</span>
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
      cell: AssetsDataTableRowActions,
    },
  ]

  return (
    <>
      <Head title="Assets" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Assets</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading title="Assets" description="Manage your media library.">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <PlusIcon className="mr-2 h-4 w-4" />
              Upload Asset
            </DialogTrigger>
            <DialogPopup>
              <DialogHeader>
                <DialogTitle>Upload New Asset</DialogTitle>
                <DialogDescription>
                  Upload an image file (jpg, png, webp, gif, svg) under 10MB.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 px-6 pb-6">
                <div>
                  {preview ? (
                    <div className="relative group">
                      <div className="overflow-hidden rounded-lg border">
                        <img src={preview} alt="Preview" className="max-h-48 w-full object-cover" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 transition-colors group-hover:bg-black/30">
                        <span className="rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                          Click to replace
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-10 rounded-full bg-background/90 p-1 opacity-0 shadow-sm transition-opacity hover:bg-background group-hover:opacity-100"
                        onClick={() => {
                          setPreview(null)
                          reset('file')
                        }}
                      >
                        ✕
                      </Button>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2"
                        aria-label="Upload asset file"
                      />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      type="button"
                      className="relative flex min-h-36 w-full cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25 transition-colors hover:border-muted-foreground/50"
                      onClick={() => document.getElementById('asset-file-input')?.click()}
                    >
                      <UploadIcon className="size-8 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        Click or drag and drop to upload
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        PNG, JPG, GIF, WebP, SVG up to 10MB
                      </p>
                      <input
                        id="asset-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </Button>
                  )}
                </div>
                <div>
                  <Select value={data.type} onValueChange={(val) => setData('type', val as any)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AssetTypes).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    placeholder="Alt text"
                    value={data.altText}
                    onChange={(e) => setData('altText', e.target.value)}
                    aria-label="Alt text"
                  />
                  <Input
                    placeholder="Credit"
                    value={data.credit}
                    onChange={(e) => setData('credit', e.target.value)}
                    aria-label="Credit"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleUpload} disabled={processing || !data.file} size="sm">
                  <UploadIcon className="mr-2 h-4 w-4" />
                  {processing ? 'Uploading...' : 'Upload'}
                </Button>
              </DialogFooter>
            </DialogPopup>
          </Dialog>
        </Heading>

        <div className="flex-1 overflow-auto py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="space-y-4">
            <AssetsTableFilters
              querySearch={querySearch}
              setQuerySearch={setQuerySearch}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
              dateFrom={dateFromState}
              setDateFrom={setDateFrom}
              dateTo={dateToState}
              setDateTo={setDateTo}
              limit={assets.metadata.perPage}
            />
            <DataTable
              columns={columns}
              data={assets.data}
              remoteTableOptions={remoteTableOptions}
            />
          </div>
        </div>
      </Main>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewAsset} onOpenChange={(open) => !open && setPreviewAsset(null)}>
        <DialogPopup className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{previewAsset?.altText || 'Asset Preview'}</DialogTitle>
          </DialogHeader>
          {previewAsset?.url && (
            <div className="flex justify-center px-6">
              <img
                src={previewAsset.url}
                alt={previewAsset.altText || ''}
                className="max-h-[70vh] rounded object-contain"
              />
            </div>
          )}
        </DialogPopup>
      </Dialog>
    </>
  )
}

AdminAssets.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
