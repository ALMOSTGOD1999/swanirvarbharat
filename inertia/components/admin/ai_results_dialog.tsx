import React, { useState } from 'react'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogPanel,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Spinner } from '~/components/ui/spinner'
import { Badge } from '~/components/ui/badge'
import { Input } from '~/components/ui/input'
import { Field, FieldLabel } from '~/components/ui/field'
import { CopyIcon, CheckIcon } from 'lucide-react'

interface AiResultsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  error: string | null
  onApply: () => void
  children: React.ReactNode
  title: string
  description?: string
}

export function AiResultsDialog({
  open,
  onOpenChange,
  loading,
  error,
  onApply,
  children,
  title,
  description,
}: AiResultsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogPanel>
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Spinner className="size-8" />
              <p className="text-sm text-muted-foreground">AI is generating results...</p>
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
          {!loading && !error && children}
        </DialogPanel>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />} />
          <Button onClick={onApply} disabled={loading}>
            Apply
          </Button>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  )
}

interface Chapter {
  start: string
  end: string
  text: string
}

interface ChaptersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  error: string | null
  onGenerate: () => void
  onApply: (chapters: Chapter[]) => void
}

export function ChaptersDialog({
  open,
  onOpenChange,
  loading,
  error,
  onGenerate,
  onApply,
}: ChaptersDialogProps) {
  const [chapters, setChapters] = useState<Chapter[]>([])

  const handleApply = () => {
    onApply(chapters)
  }

  const updateChapter = (index: number, field: keyof Chapter, value: string) => {
    setChapters((prev) => prev.map((ch, i) => (i === index ? { ...ch, [field]: value } : ch)))
  }

  const removeChapter = (index: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== index))
  }

  const addChapter = () => {
    setChapters((prev) => [...prev, { start: '00:00', end: '00:00', text: '' }])
  }

  return (
    <AiResultsDialog
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      error={error}
      onApply={handleApply}
      title="Generate Chapters"
      description="AI-generated chapters from video transcript. Edit as needed before applying."
    >
      <div className="space-y-4">
        {chapters.length === 0 && !loading && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              No chapters generated yet. Click the button below to generate.
            </p>
            <Button onClick={onGenerate}>Generate Chapters</Button>
          </div>
        )}
        {chapters.map((chapter, index) => (
          <div
            key={`${chapter.start}-${chapter.end}-${chapter.text}-${index}`}
            className="flex flex-col gap-2 rounded-lg border p-3 relative"
          >
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Chapter {index + 1}</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeChapter(index)}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove chapter"
              >
                <span className="sr-only">Remove</span>
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
                  aria-label="Remove chapter"
                >
                  <title>Remove</title>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field name={`chapter-${index}-start`}>
                <FieldLabel htmlFor={`chapter-${index}-start`}>Start</FieldLabel>
                <Input
                  id={`chapter-${index}-start`}
                  value={chapter.start}
                  onChange={(e) => updateChapter(index, 'start', e.target.value)}
                  placeholder="00:00"
                  aria-label="Chapter start time"
                />
              </Field>
              <Field name={`chapter-${index}-end`}>
                <FieldLabel htmlFor={`chapter-${index}-end`}>End</FieldLabel>
                <Input
                  id={`chapter-${index}-end`}
                  value={chapter.end}
                  onChange={(e) => updateChapter(index, 'end', e.target.value)}
                  placeholder="00:00"
                  aria-label="Chapter end time"
                />
              </Field>
            </div>
            <Field name={`chapter-${index}-text`}>
              <FieldLabel htmlFor={`chapter-${index}-text`}>Title</FieldLabel>
              <Input
                id={`chapter-${index}-text`}
                value={chapter.text}
                onChange={(e) => updateChapter(index, 'text', e.target.value)}
                placeholder="Chapter title"
                aria-label="Chapter title"
              />
            </Field>
          </div>
        ))}
        {chapters.length > 0 && (
          <Button variant="outline" onClick={addChapter} className="w-full">
            Add Chapter
          </Button>
        )}
      </div>
    </AiResultsDialog>
  )
}

interface BodyOverviewResult {
  summary: string[]
  metaDescription: string
  socialHooks: {
    twitter: string
    facebook: string
  }
}

interface BodyOverviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loading: boolean
  error: string | null
  result: BodyOverviewResult | null
  onGenerate: () => void
  onApply: (result: BodyOverviewResult) => void
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      className="text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Copy to clipboard"
    >
      {copied ? <CheckIcon className="size-4 text-green-500" /> : <CopyIcon className="size-4" />}
    </Button>
  )
}

export function BodyOverviewDialog({
  open,
  onOpenChange,
  loading,
  error,
  result,
  onGenerate,
  onApply,
}: BodyOverviewDialogProps) {
  const handleApply = () => {
    if (result) {
      onApply(result)
    }
  }

  return (
    <AiResultsDialog
      open={open}
      onOpenChange={onOpenChange}
      loading={loading}
      error={error}
      onApply={handleApply}
      title="Generate Body Overview"
      description="AI-generated metadata from lesson body content."
    >
      <div className="space-y-6">
        {result === null && !loading && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              No overview generated yet. Click the button below to generate.
            </p>
            <Button onClick={onGenerate}>Generate Overview</Button>
          </div>
        )}
        {result && (
          <>
            {/* Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Summary Bullets</h4>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                {result.summary.map((bullet) => (
                  <li key={bullet} className="text-muted-foreground">
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Meta Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Meta Description</h4>
                <CopyButton text={result.metaDescription} />
              </div>
              <p className="text-sm text-muted-foreground">{result.metaDescription}</p>
            </div>

            {/* Social Hooks */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Social Hooks</h4>
              <div className="space-y-2">
                <div className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Twitter / X</Badge>
                    <CopyButton text={result.socialHooks.twitter} />
                  </div>
                  <p className="text-sm text-muted-foreground">{result.socialHooks.twitter}</p>
                </div>
                <div className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Facebook</Badge>
                    <CopyButton text={result.socialHooks.facebook} />
                  </div>
                  <p className="text-sm text-muted-foreground">{result.socialHooks.facebook}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AiResultsDialog>
  )
}
