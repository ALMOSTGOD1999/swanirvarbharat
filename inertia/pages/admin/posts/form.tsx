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
import { TiptapEditor } from '~/components/admin/tiptap_editor'
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
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverPopup, PopoverTrigger } from '~/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, SearchIcon, UploadIcon, XIcon, SparklesIcon, ImageIcon } from 'lucide-react'
import { AssetPicker, type AssetPickerAsset } from '~/components/admin/asset_picker'

import { States } from '#enums/states'
import { PostTypes } from '#enums/posts'
import { BodyTypes } from '#enums/body'
import { VideoTypes } from '#enums/videos'
import { useQuery } from '@tanstack/react-query'
import { api, client } from '~/client'
import { useFileUpload } from '~/hooks/use-file-upload'
import { Data } from '@generated/data'
import { ChaptersDialog, BodyOverviewDialog } from '~/components/admin/ai_results_dialog'

type PageProps = InertiaProps<{
  post?: Data.Post & { taxonomyIds?: string[]; thumbnail?: Data.Asset }
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

export default function AdminPostsCreate({ post }: PageProps) {
  const isEdit = !!post

  const [showExistingThumbnail, setShowExistingThumbnail] = useState(!!post?.thumbnail?.url)

  // Asset picker state — when user picks from existing assets
  const [selectedAsset, setSelectedAsset] = useState<AssetPickerAsset | null>(null)

  const [publishDate, setPublishDate] = useState<Date | undefined>(
    post?.publishedAtUser ? new Date(post.publishedAtUser) : undefined
  )

  const taxonomiesQuery = useQuery(
    api.admin.taxonomies.apiIndex.queryOptions({}, { staleTime: Infinity })
  )
  const taxonomies = taxonomiesQuery.data ?? []

  const taxonomyItems = taxonomies.map((t) => ({ value: t.id, label: t.name }))
  const defaultTaxonomyIds = post?.taxonomyIds

  const [{ files: thumbnailFiles, isDragging }, thumbnailActions] = useFileUpload({
    accept: 'image/*',
    multiple: false,
  })

  const thumbnailFileRef = useRef<HTMLInputElement>(null)

  // AI Chapters state
  const [chaptersDialogOpen, setChaptersDialogOpen] = useState(false)
  const [chaptersLoading, setChaptersLoading] = useState(false)
  const [chaptersError, setChaptersError] = useState<string | null>(null)
  const [chaptersData, setChaptersData] = useState<string>('')

  // AI Body Overview state
  const [bodyOverviewDialogOpen, setBodyOverviewDialogOpen] = useState(false)
  const [bodyOverviewLoading, setBodyOverviewLoading] = useState(false)
  const [bodyOverviewError, setBodyOverviewError] = useState<string | null>(null)
  const [bodyOverviewResult, setBodyOverviewResult] = useState<{
    summary: string[]
    metaDescription: string
    socialHooks: { twitter: string; facebook: string }
  } | null>(null)

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

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /^([a-zA-Z0-9_-]{11})$/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  // Generate chapters from YouTube video
  const handleGenerateChapters = async () => {
    const videoUrlInput = document.getElementById('videoUrl') as HTMLInputElement | null
    const videoUrl = videoUrlInput?.value ?? ''
    const videoId = extractYouTubeId(videoUrl)

    if (!videoId) {
      setChaptersError('Please enter a valid YouTube video URL first.')
      return
    }

    setChaptersLoading(true)
    setChaptersError(null)

    try {
      const url = client.urlFor('admin.ai.video_chapters', { videoId })
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Failed to generate chapters: ${res.status} ${text}`)
      }

      const data = await res.json()
      const chapters = data.chapters ?? []
      setChaptersData(JSON.stringify(chapters))
      setChaptersDialogOpen(true)
    } catch (err: unknown) {
      setChaptersError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setChaptersLoading(false)
    }
  }

  // Handle applying chapters
  const handleApplyChapters = (chapters: { start: string; end: string; text: string }[]) => {
    setChaptersData(JSON.stringify(chapters))
    setChaptersDialogOpen(false)
  }

  // Generate body overview
  const handleGenerateBodyOverview = async () => {
    if (!isEdit || !post?.id) {
      setBodyOverviewError('Please save the post first before generating an overview.')
      return
    }

    const bodyInput = document.querySelector('input[name="body"]') as HTMLInputElement | null
    const bodyContent = bodyInput?.value ?? ''

    if (!bodyContent.trim()) {
      setBodyOverviewError('Please add content to the body field first.')
      return
    }

    setBodyOverviewLoading(true)
    setBodyOverviewError(null)

    try {
      const url = client.urlFor('admin.ai.body_overview', { lessonId: post.id })
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ body: bodyContent }),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`Failed to generate overview: ${res.status} ${text}`)
      }

      const data = await res.json()
      setBodyOverviewResult(data)
      setBodyOverviewDialogOpen(true)
    } catch (err: unknown) {
      setBodyOverviewError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setBodyOverviewLoading(false)
    }
  }

  // Handle applying body overview
  const handleApplyBodyOverview = (result: {
    summary: string[]
    metaDescription: string
    socialHooks: { twitter: string; facebook: string }
  }) => {
    // Auto-fill metaDescription field
    const metaDescInput = document.getElementById('metaDescription') as HTMLTextAreaElement | null
    if (metaDescInput) {
      metaDescInput.value = result.metaDescription
    }

    // Auto-fill description field
    const descInput = document.getElementById('description') as HTMLTextAreaElement | null
    if (descInput) {
      descInput.value = result.summary.join(' ')
    }

    setBodyOverviewDialogOpen(false)
  }

  return (
    <>
      <Head title={isEdit ? 'Edit Post' : 'Create Post'} />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link route="posts.index" />}>Posts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{isEdit ? 'Edit Post' : 'Create Post'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Form
          route={isEdit ? 'admin.posts.update' : 'admin.posts.create'}
          routeParams={{ id: isEdit ? post.id : undefined }}
        >
          {({ processing }) => (
            <div className="flex flex-col gap-8 py-4">
              {/* Content */}
              <Section title="Content" description="Title, description, and body of the post">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field name="title">
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      type="text"
                      id="title"
                      required
                      minLength={3}
                      maxLength={200}
                      defaultValue={post?.title ?? undefined}
                      aria-label="Title"
                    />
                    <FieldError />
                  </Field>
                  <Field name="slug">
                    <FieldLabel htmlFor="slug">Slug</FieldLabel>
                    <Input
                      type="text"
                      id="slug"
                      maxLength={255}
                      defaultValue={post?.slug ?? undefined}
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
                    defaultValue={post?.description ?? undefined}
                    aria-label="Description"
                  />
                  <FieldError />
                </Field>
                <Field name="body">
                  <FieldLabel>Body</FieldLabel>
                  <div className="flex flex-col gap-2">
                    <TiptapEditor name="body" defaultValue={post?.body ?? undefined} />
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateBodyOverview}
                        disabled={bodyOverviewLoading}
                      >
                        {bodyOverviewLoading ? (
                          <span className="animate-spin">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-label="Loading"
                            >
                              <title>Loading</title>
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                          </span>
                        ) : (
                          <SparklesIcon className="size-4" />
                        )}
                        Generate Overview
                      </Button>
                    </div>
                  </div>
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Publishing */}
              <Section title="Publishing" description="Control visibility and scheduling">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field name="state">
                    <FieldLabel>State</FieldLabel>
                    <Select name="state" defaultValue={post?.state ?? States.DRAFT}>
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
                  <Field name="publishedAtUser">
                    <FieldLabel>Publish At</FieldLabel>
                    <input
                      type="hidden"
                      name="publishedAtUser"
                      value={publishDate ? format(publishDate, "yyyy-MM-dd'T'HH:mm") : ''}
                    />
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            className="w-full justify-start text-left font-normal"
                            variant="outline"
                          />
                        }
                      >
                        <CalendarIcon aria-hidden="true" />
                        {publishDate ? format(publishDate, 'PPP') : 'Pick a date'}
                      </PopoverTrigger>
                      <PopoverPopup align="start">
                        <Calendar
                          defaultMonth={publishDate}
                          mode="single"
                          onSelect={setPublishDate}
                          selected={publishDate}
                        />
                      </PopoverPopup>
                    </Popover>
                    <FieldError />
                  </Field>
                </div>
                <Field name="timezone">
                  <FieldLabel htmlFor="timezone">Timezone</FieldLabel>
                  <Input
                    type="text"
                    id="timezone"
                    placeholder="e.g. Asia/Kolkata"
                    maxLength={100}
                    defaultValue={post?.timezone ?? undefined}
                    aria-label="Timezone"
                  />
                  <FieldError />
                </Field>
                <div className="flex items-center gap-8">
                  <Field name="isFeatured">
                    <div className="flex items-center gap-2">
                      <Switch id="isFeatured" name="isFeatured" defaultChecked={post?.isFeatured} />
                      <FieldLabel htmlFor="isFeatured">Featured</FieldLabel>
                    </div>
                    <FieldError />
                  </Field>
                  <Field name="isPersonal">
                    <div className="flex items-center gap-2">
                      <Switch id="isPersonal" name="isPersonal" defaultChecked={post?.isPersonal} />
                      <FieldLabel htmlFor="isPersonal">Personal</FieldLabel>
                    </div>
                    <FieldError />
                  </Field>
                </div>
              </Section>

              <Separator />

              {/* Configuration */}
              <Section title="Configuration" description="Post and body type settings">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field name="postType">
                    <FieldLabel>Post Type</FieldLabel>
                    <Select name="postType" defaultValue={post?.postType ?? PostTypes.LESSON}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select post type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PostTypes).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>
                  <Field name="bodyType">
                    <FieldLabel>Body Type</FieldLabel>
                    <Select name="bodyType" defaultValue={post?.bodyType ?? BodyTypes.HTML}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(BodyTypes).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>
                </div>
              </Section>

              <Separator />

              {/* Taxonomies */}
              <Section title="Taxonomies" description="Assign taxonomies to this post">
                <Field name="taxonomyIds">
                  <FieldLabel>Taxonomies</FieldLabel>
                  <Combobox
                    items={taxonomyItems}
                    multiple
                    name="taxonomyIds"
                    defaultValue={
                      defaultTaxonomyIds
                        ?.map((id) => taxonomyItems.find((t: any) => t.value === id))
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
              <Section title="Thumbnail" description="Post thumbnail image and metadata">
                {/* Choose existing or upload new */}
                <p className="text-sm font-medium">Image</p>
                <div className="flex items-center gap-2">
                  <AssetPicker
                    type="thumbnail"
                    onSelect={(asset) => {
                      setSelectedAsset(asset)
                      // Clear any uploaded file
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
                        thumbnailFiles.length > 0 || (showExistingThumbnail && post?.thumbnail?.url)
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
                      ) : showExistingThumbnail && post?.thumbnail?.url ? (
                        <div className="group relative w-full">
                          <img
                            src={post.thumbnail.url}
                            alt={post.thumbnail.altText || 'Current thumbnail'}
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
                    defaultValue={post?.thumbnail?.altText ?? undefined}
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
                    defaultValue={post?.thumbnail?.credit ?? undefined}
                  />
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Video */}
              <Section title="Video" description="Video and livestream settings">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field name="videoType">
                    <FieldLabel>Video Type</FieldLabel>
                    <Select name="videoType" defaultValue={post?.videoType ?? VideoTypes.NONE}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select video type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(VideoTypes).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>
                  <Field name="videoUrl">
                    <FieldLabel htmlFor="videoUrl">Video URL</FieldLabel>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        id="videoUrl"
                        maxLength={255}
                        defaultValue={post?.videoUrl ?? undefined}
                        aria-label="Video URL"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleGenerateChapters}
                        disabled={chaptersLoading}
                      >
                        {chaptersLoading ? (
                          <span className="animate-spin">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-label="Loading"
                            >
                              <title>Loading</title>
                              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                          </span>
                        ) : (
                          <SparklesIcon className="size-4" />
                        )}
                        <span className="sr-only sm:not-sr-only">Generate Chapters</span>
                      </Button>
                    </div>
                    <FieldError />
                  </Field>
                </div>
                <Field name="videoBunnyId">
                  <FieldLabel htmlFor="videoBunnyId">Bunny Video ID</FieldLabel>
                  <Input
                    type="text"
                    id="videoBunnyId"
                    maxLength={500}
                    defaultValue={post?.videoBunnyId ?? undefined}
                    aria-label="Bunny Video ID"
                  />
                  <FieldError />
                </Field>
                <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
                  <Field name="isLivestream">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="isLivestream"
                        name="isLivestream"
                        defaultChecked={post?.isLivestream}
                      />
                      <FieldLabel htmlFor="isLivestream">Enable Livestream</FieldLabel>
                    </div>
                    <FieldError />
                  </Field>
                  <Field name="livestreamUrl">
                    <FieldLabel htmlFor="livestreamUrl">Livestream URL</FieldLabel>
                    <Input
                      type="url"
                      id="livestreamUrl"
                      maxLength={255}
                      defaultValue={post?.livestreamUrl ?? undefined}
                      aria-label="Livestream URL"
                    />
                    <FieldError />
                  </Field>
                </div>
                <input type="hidden" name="chapters" value={chaptersData} />
              </Section>

              <Separator />

              {/* SEO */}
              <Section title="SEO" description="Search engine optimization metadata">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field name="pageTitle">
                    <FieldLabel htmlFor="pageTitle">Page Title</FieldLabel>
                    <Input
                      type="text"
                      id="pageTitle"
                      maxLength={255}
                      defaultValue={post?.pageTitle ?? undefined}
                      aria-label="Page Title"
                    />
                    <FieldError />
                  </Field>
                  <Field name="canonical">
                    <FieldLabel htmlFor="canonical">Canonical URL</FieldLabel>
                    <Input
                      type="url"
                      id="canonical"
                      maxLength={255}
                      defaultValue={post?.canonical ?? undefined}
                      aria-label="Canonical URL"
                    />
                    <FieldError />
                  </Field>
                </div>
                <Field name="metaDescription">
                  <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
                  <Textarea
                    id="metaDescription"
                    rows={3}
                    maxLength={255}
                    defaultValue={post?.metaDescription ?? undefined}
                    aria-label="Meta Description"
                  />
                  <FieldError />
                </Field>
                <Field name="redirectUrl">
                  <FieldLabel htmlFor="redirectUrl">Redirect URL</FieldLabel>
                  <Input
                    type="url"
                    id="redirectUrl"
                    maxLength={255}
                    defaultValue={post?.redirectUrl ?? undefined}
                    aria-label="Redirect URL"
                  />
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Link
                  route="posts.index"
                  className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Cancel
                </Link>
                <Button type="submit" disabled={processing}>
                  {isEdit ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </div>
          )}
        </Form>

        {/* AI Dialogs */}
        <ChaptersDialog
          open={chaptersDialogOpen}
          onOpenChange={setChaptersDialogOpen}
          loading={chaptersLoading}
          error={chaptersError}
          onGenerate={handleGenerateChapters}
          onApply={handleApplyChapters}
        />
        <BodyOverviewDialog
          open={bodyOverviewDialogOpen}
          onOpenChange={setBodyOverviewDialogOpen}
          loading={bodyOverviewLoading}
          error={bodyOverviewError}
          result={bodyOverviewResult}
          onGenerate={handleGenerateBodyOverview}
          onApply={handleApplyBodyOverview}
        />
      </Main>
    </>
  )
}
AdminPostsCreate.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
