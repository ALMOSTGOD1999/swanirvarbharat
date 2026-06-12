'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchIcon, ImageIcon, XIcon } from 'lucide-react'
import {
  Dialog,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { api } from '~/client'

export type AssetPickerAsset = {
  id: string
  type: string
  altText: string | null
  credit: string | null
  createdAt: string | null
  url?: string | null
}

type AssetPickerProps = {
  onSelect: (asset: AssetPickerAsset) => void
  trigger?: React.ReactNode
  type?: string
}

export function AssetPicker({ onSelect, trigger, type }: AssetPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const queryOptions = api.admin.assets.apiIndex.queryOptions(
    {
      query: {
        q: debouncedSearch || undefined,
        types: type ? [type.toUpperCase()] : undefined,
      },
    },
    { enabled: open }
  )

  const { data: assets, isLoading } = useQuery(queryOptions)

  const handleSelect = useCallback(
    (asset: AssetPickerAsset) => {
      onSelect(asset)
      setOpen(false)
      setSearch('')
    },
    [onSelect]
  )

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      setSearch('')
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger ?? (
        <DialogTrigger render={<Button variant="outline" />}>Choose Existing</DialogTrigger>
      )}
      <DialogPopup className="max-w-2xl" showCloseButton>
        <DialogHeader className="pb-3">
          <DialogTitle>Choose an Asset</DialogTitle>
          <div className="relative">
            <SearchIcon className="absolute inset-s-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
              aria-label="Search assets"
            />
            {search && (
              <button
                type="button"
                className="absolute inset-e-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch('')}
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              Loading assets...
            </div>
          ) : assets && assets.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  className="relative cursor-pointer overflow-hidden rounded-lg border-2 border-muted-foreground/25 transition-colors hover:border-primary"
                  onClick={() => handleSelect(asset)}
                >
                  {asset.url ? (
                    <img
                      src={asset.url}
                      alt={asset.altText ?? ''}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground">
                      <ImageIcon className="size-8" />
                    </div>
                  )}
                  {asset.altText && (
                    <div className="bg-background p-1.5">
                      <p className="text-xs text-muted-foreground truncate">{asset.altText}</p>
                    </div>
                  )}
                  {asset.credit && (
                    <div className="bg-background px-1.5 pb-1.5">
                      <p className="text-xs text-muted-foreground truncate">{asset.credit}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ImageIcon className="mb-2 size-10 opacity-50" />
              <p className="text-sm">No assets found</p>
            </div>
          )}
        </ScrollArea>
      </DialogPopup>
    </Dialog>
  )
}
