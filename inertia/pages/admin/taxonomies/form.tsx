import type { InertiaProps } from '~/types'
import React, { useEffect, useRef, useState } from 'react'
import AdminLayout from '~/layouts/admin'
import { Head } from '@inertiajs/react'
import { Header } from '~/components/header'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Main } from '~/components/main'
import { Form } from '~/components/ui/form'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Switch } from '~/components/ui/switch'
import { Separator } from '~/components/ui/separator'
import { UploadIcon, XIcon, ImageIcon } from 'lucide-react'
import { AssetPicker, type AssetPickerAsset } from '~/components/admin/asset_picker'

import { TaxonomyTypes } from '#enums/taxonomy'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/client'
import { Data } from '@generated/data'
import { useFileUpload } from '~/hooks/use-file-upload'

type PageProps = InertiaProps<{
  taxonomy?: Data.Taxonomy
}>

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

export default function AdminTaxonomiesForm({ taxonomy }: PageProps) {
  const isEdit = !!taxonomy

  const taxonomyQuery = useQuery(
    api.admin.taxonomies.apiIndex.queryOptions({}, { staleTime: Infinity })
  )
  const allTaxonomies = taxonomyQuery.data ?? []
  const availableParents = isEdit
    ? allTaxonomies.filter((t) => t.id !== taxonomy.id)
    : allTaxonomies

  const [parentId, setParentId] = useState<string | null>(taxonomy?.parentId ?? null)
  const parentName = availableParents.find((t) => t.id === parentId)?.name

  // Thumbnail state
  const [showExistingThumbnail, setShowExistingThumbnail] = useState(!!taxonomy?.asset?.url)
  const [selectedAsset, setSelectedAsset] = useState<AssetPickerAsset | null>(null)
  const [{ files: thumbnailFiles, isDragging }, thumbnailActions] = useFileUpload({
    accept: 'image/*',
    multiple: false,
  })
  const thumbnailFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (thumbnailFileRef.current) {
      if (thumbnailFiles.length > 0 && thumbnailFiles[0].file instanceof File) {
        const dt = new DataTransfer()
        dt.items.add(thumbnailFiles[0].file)
        thumbnailFileRef.current.files = dt.files
      } else {
        thumbnailFileRef.current.value = ''
      }
    }
  }, [thumbnailFiles])

  const title = isEdit ? 'Edit Taxonomy' : 'Create Taxonomy'

  return (
    <>
      <Head title={title} />
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link route="admin.taxonomies.index" />}>
                Taxonomies
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Form
          route={isEdit ? 'admin.taxonomies.update' : 'admin.taxonomies.create'}
          routeParams={isEdit ? { id: taxonomy.id } : {}}
        >
          {({ processing }) => (
            <div className="flex flex-col gap-8 py-4">
              {/* Content */}
              <Section title="Content" description="Name and description of the taxonomy">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field name="name">
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      type="text"
                      id="name"
                      required
                      minLength={2}
                      maxLength={50}
                      defaultValue={taxonomy?.name}
                      aria-label="Name"
                    />
                    <FieldError />
                  </Field>
                  <Field name="slug">
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Input
                      type="text"
                      id="slug"
                      maxLength={100}
                      defaultValue={taxonomy?.slug}
                      aria-label="Slug"
                    />
                    <FieldError />
                  </Field>
                </div>
                <Field name="description">
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    rows={3}
                    maxLength={255}
                    defaultValue={taxonomy?.description}
                  />
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Settings */}
              <Section title="Settings" description="Type, parent, and visibility options">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field name="type">
                    <FieldLabel>Type</FieldLabel>
                    <Select name="type" defaultValue={taxonomy?.type ?? TaxonomyTypes.CONTENT}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TaxonomyTypes).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>
                  <Field name="parentId">
                    <FieldLabel>Parent Taxonomy</FieldLabel>
                    <input type="hidden" name="parentId" value={parentId ?? ''} />
                    <Select
                      value={parentId ?? ''}
                      onValueChange={(val) => setParentId(val === '' ? null : val)}
                      disabled={taxonomyQuery.isLoading || availableParents.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            taxonomyQuery.isLoading
                              ? 'Loading...'
                              : availableParents.length === 0
                                ? 'No taxonomies available'
                                : 'None (root taxonomy)'
                          }
                        >
                          {parentName ?? 'None (root taxonomy)'}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None (root taxonomy)</SelectItem>
                        {availableParents.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>
                </div>
                <Field name="isFeatured">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="isFeatured"
                      name="isFeatured"
                      defaultChecked={taxonomy?.isFeatured}
                    />
                    <FieldLabel htmlFor="isFeatured">Featured</FieldLabel>
                  </div>
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Thumbnail */}
              <Section title="Thumbnail" description="Taxonomy thumbnail image and metadata">
                <p className="text-sm font-medium">Image</p>
                <div className="flex items-center gap-2">
                  <AssetPicker
                    type="thumbnail"
                    onSelect={(asset) => {
                      setSelectedAsset(asset)
                      thumbnailActions.clearFiles()
                      setShowExistingThumbnail(false)
                    }}
                  />
                  <span className="text-xs text-muted-foreground">or</span>
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    onClick={() => {
                      setSelectedAsset(null)
                      thumbnailActions.openFileDialog()
                    }}
                  >
                    <UploadIcon className="mr-1.5 size-3.5" />
                    Upload New
                  </Button>
                </div>

                {/* Selected existing asset preview */}
                {selectedAsset && (
                  <div className="relative overflow-hidden rounded-lg border-2 border-primary">
                    {selectedAsset.url ? (
                      <img
                        src={selectedAsset.url}
                        alt={selectedAsset.altText || 'Selected thumbnail'}
                        className="block max-h-64 w-full object-cover"
                      />
                    ) : (
                      <div className="flex min-h-36 items-center justify-center bg-muted">
                        <ImageIcon className="size-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 z-10 rounded-full bg-background/90 p-1 shadow-sm hover:bg-background"
                      onClick={() => setSelectedAsset(null)}
                    >
                      <XIcon className="size-4" />
                    </Button>
                    <input type="hidden" name="thumbnail.assetId" value={selectedAsset.id} />
                  </div>
                )}

                {/* Upload dropzone */}
                {!selectedAsset && (
                  <Field name="thumbnail.file">
                    <Button
                      variant="outline"
                      type="button"
                      aria-label="Upload thumbnail image"
                      className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed transition-colors ${
                        thumbnailFiles.length > 0 || (showExistingThumbnail && taxonomy?.asset?.url)
                          ? '!h-auto min-h-0 !p-0'
                          : 'min-h-36'
                      } ${
                        isDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                      }`}
                      onClick={thumbnailActions.openFileDialog}
                      onDragEnter={thumbnailActions.handleDragEnter}
                      onDragLeave={thumbnailActions.handleDragLeave}
                      onDragOver={thumbnailActions.handleDragOver}
                      onDrop={thumbnailActions.handleDrop}
                    >
                      {thumbnailFiles.length > 0 && thumbnailFiles[0].preview ? (
                        <div className="group relative w-full">
                          <img
                            src={thumbnailFiles[0].preview}
                            alt="Thumbnail preview"
                            className="block max-h-64 w-full rounded-[5px] object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center rounded-[5px] bg-black/0 transition-colors group-hover:bg-black/30">
                            <span className="rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                              Click to replace
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 z-10 rounded-full bg-background/90 p-1 opacity-0 shadow-sm transition-opacity hover:bg-background group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              thumbnailActions.removeFile(thumbnailFiles[0].id)
                            }}
                          >
                            <XIcon className="size-4" />
                          </Button>
                        </div>
                      ) : showExistingThumbnail && taxonomy?.asset?.url ? (
                        <div className="group relative w-full">
                          <img
                            src={taxonomy?.asset?.url}
                            alt={taxonomy?.asset?.altText || 'Current thumbnail'}
                            className="block max-h-64 w-full rounded-[5px] object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center rounded-[5px] bg-black/0 transition-colors group-hover:bg-black/30">
                            <span className="rounded-md bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
                              Click to replace
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 z-10 rounded-full bg-background/90 p-1 opacity-0 shadow-sm transition-opacity hover:bg-background group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              setShowExistingThumbnail(false)
                            }}
                          >
                            <XIcon className="size-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <UploadIcon className="size-8 text-muted-foreground/50" />
                          <p className="text-sm text-muted-foreground">
                            Click or drag and drop to upload
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </>
                      )}
                    </Button>
                    <input {...thumbnailActions.getInputProps()} className="sr-only" />
                    <input
                      ref={thumbnailFileRef}
                      type="file"
                      name="thumbnail.file"
                      accept="image/*"
                      className="sr-only"
                    />
                    {isEdit && !showExistingThumbnail && thumbnailFiles.length === 0 && (
                      <input type="hidden" name="thumbnail.file" value="null" />
                    )}
                    <FieldError />
                  </Field>
                )}
                <Field name="thumbnail.altText">
                  <FieldLabel htmlFor="thumbnailAltText">Alt Text</FieldLabel>
                  <Input
                    type="text"
                    id="thumbnailAltText"
                    name="thumbnail.altText"
                    placeholder="Describe the image for accessibility"
                    maxLength={255}
                    aria-label="Thumbnail Alt Text"
                    defaultValue={taxonomy?.asset?.altText ?? undefined}
                  />
                  <FieldError />
                </Field>
                <Field name="thumbnail.credit">
                  <FieldLabel htmlFor="thumbnailCredit">Credit</FieldLabel>
                  <Input
                    type="text"
                    id="thumbnailCredit"
                    name="thumbnail.credit"
                    placeholder="Image credit or source"
                    maxLength={255}
                    aria-label="Thumbnail Credit"
                    defaultValue={taxonomy?.asset?.credit ?? undefined}
                  />
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* SEO */}
              <Section title="SEO" description="Search engine optimization metadata">
                <Field name="pageTitle">
                  <FieldLabel htmlFor="pageTitle">Page Title</FieldLabel>
                  <Input
                    type="text"
                    id="pageTitle"
                    maxLength={100}
                    defaultValue={taxonomy?.pageTitle}
                    aria-label="Page Title"
                  />
                  <FieldError />
                </Field>
                <Field name="metaDescription">
                  <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
                  <Textarea
                    id="metaDescription"
                    rows={3}
                    maxLength={255}
                    defaultValue={taxonomy?.metaDescription}
                  />
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Button
                  variant="ghost"
                  render={<Link route="admin.taxonomies.index">Cancel</Link>}
                />
                <Button type="submit" disabled={processing}>
                  {isEdit ? 'Update Taxonomy' : 'Create Taxonomy'}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Main>
    </>
  )
}
AdminTaxonomiesForm.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
