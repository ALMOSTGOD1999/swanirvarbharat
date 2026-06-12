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
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxValue,
} from '~/components/ui/combobox'
import { Switch } from '~/components/ui/switch'
import { Separator } from '~/components/ui/separator'
import { SearchIcon, UploadIcon, XIcon, ImageIcon } from 'lucide-react'
import { AssetPicker, type AssetPickerAsset } from '~/components/admin/asset_picker'

import { States } from '#enums/states'
import { Difficulties } from '#enums/difficulties'
import { useFileUpload } from '~/hooks/use-file-upload'

type TaxonomyOption = { id: string; name: string }
type AccessLevelOption = { id: string; name: string; color: string }

type PageProps = InertiaProps<{
  course?: any
  taxonomies: TaxonomyOption[]
  accessLevels: AccessLevelOption[]
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

export default function AdminCoursesForm({ course, taxonomies, accessLevels }: PageProps) {
  const isEdit = !!course

  const [showExistingThumbnail, setShowExistingThumbnail] = useState(!!course?.asset?.url)

  // Asset picker state — when user picks from existing assets
  const [selectedAsset, setSelectedAsset] = useState<AssetPickerAsset | null>(null)

  const taxonomyItems = taxonomies.map((t) => ({ value: t.id, label: t.name }))
  const defaultTaxonomyIds = Array.isArray(course?.taxonomies)
    ? course.taxonomies.map((t: any) => t.id)
    : []

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

  return (
    <>
      <Head title={isEdit ? 'Edit Course' : 'Create Course'} />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link route="admin.courses.index" />}>Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEdit ? 'Edit Course' : 'Create Course'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Form
          route={isEdit ? 'admin.courses.update' : 'admin.courses.create'}
          routeParams={{ id: isEdit ? course.id : undefined }}
        >
          {({ processing }) => (
            <div className="flex flex-col gap-8 py-4">
              {/* Content */}
              <Section title="Content" description="Title, description, and details of the course">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field name="name">
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      type="text"
                      id="name"
                      required
                      minLength={3}
                      maxLength={255}
                      defaultValue={course?.name ?? undefined}
                      aria-label="Name"
                    />
                    <FieldError />
                  </Field>
                  <Field name="slug">
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Input
                      type="text"
                      id="slug"
                      maxLength={255}
                      defaultValue={course?.slug ?? undefined}
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
                    defaultValue={course?.description ?? undefined}
                    aria-label="Description"
                  />
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Publishing */}
              <Section title="Publishing" description="Control visibility, access, and status">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field name="state">
                    <FieldLabel>State</FieldLabel>
                    <Select name="state" defaultValue={course?.state ?? States.DRAFT}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(States).map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>
                  <Field name="difficulty">
                    <FieldLabel>Difficulty</FieldLabel>
                    <Select
                      name="difficulty"
                      defaultValue={course?.difficulty ?? Difficulties.BEGINNER}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Difficulties).map((diff) => (
                          <SelectItem key={diff} value={diff}>
                            {diff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>
                </div>
                <Field name="accessLevelId">
                  <FieldLabel>Access Level</FieldLabel>
                  <Select
                    name="accessLevelId"
                    defaultValue={course?.accessLevelId ?? accessLevels[0]?.id ?? ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessLevels.map((al) => (
                        <SelectItem key={al.id} value={al.id}>
                          {al.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError />
                </Field>
                <Field name="isFeatured">
                  <div className="flex items-center gap-2">
                    <Switch id="isFeatured" name="isFeatured" defaultChecked={course?.isFeatured} />
                    <FieldLabel htmlFor="isFeatured">Featured</FieldLabel>
                  </div>
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Taxonomies */}
              <Section title="Taxonomies" description="Assign taxonomies to this course">
                <Field name="taxonomyIds">
                  <FieldLabel>Taxonomies</FieldLabel>
                  <Combobox
                    items={taxonomyItems}
                    multiple
                    name="taxonomyIds"
                    defaultValue={
                      defaultTaxonomyIds
                        ?.map((id: string) => taxonomyItems.find((t) => t.value === id))
                        .filter(Boolean) as { value: string; label: string }[]
                    }
                  >
                    <ComboboxChips startAddon={<SearchIcon />}>
                      <ComboboxValue>
                        {(value: { value: string; label: string }[]) => (
                          <>
                            {value?.map((item) => (
                              <ComboboxChip aria-label={item.label} key={item.value}>
                                {item.label}
                              </ComboboxChip>
                            ))}
                            <ComboboxChipsInput
                              aria-label="Select taxonomies"
                              placeholder={value.length > 0 ? undefined : 'Search taxonomies...'}
                            />
                          </>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxPopup>
                      <ComboboxEmpty>No taxonomies found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item.value} value={item}>
                            {item.label}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxPopup>
                  </Combobox>
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Thumbnail */}
              <Section title="Thumbnail" description="Course thumbnail image and metadata">
                {/* Choose existing or upload new */}
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

                {/* Upload dropzone (hidden when asset is selected from picker) */}
                {!selectedAsset && (
                  <Field name="thumbnail.file">
                    <Button
                      variant="outline"
                      type="button"
                      aria-label="Upload thumbnail image"
                      className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden border-2 border-dashed transition-colors ${
                        thumbnailFiles.length > 0 || (showExistingThumbnail && course?.asset?.url)
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
                      ) : showExistingThumbnail && course?.asset?.url ? (
                        <div className="group relative w-full">
                          <img
                            src={course.asset.url}
                            alt={course.asset.altText || 'Current thumbnail'}
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
                    defaultValue={course?.asset?.altText ?? undefined}
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
                    defaultValue={course?.asset?.credit ?? undefined}
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
                    maxLength={255}
                    defaultValue={course?.pageTitle ?? undefined}
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
                    defaultValue={course?.metaDescription ?? undefined}
                    aria-label="Meta Description"
                  />
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Link
                  route="admin.courses.index"
                  className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Cancel
                </Link>
                <Button type="submit" disabled={processing}>
                  {isEdit ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Main>
    </>
  )
}

AdminCoursesForm.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
