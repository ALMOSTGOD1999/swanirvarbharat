import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { PlusCircle, SearchIcon } from 'lucide-react'

import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
  ComboboxTrigger,
} from '~/components/ui/combobox'
import { Separator } from '~/components/ui/separator'

export type CheckboxOption<T extends string> = {
  label: string
  value: T
  icon?: LucideIcon
  counts?: number
}

type CheckboxFilterProps<T extends string> = {
  title: string
  options: readonly CheckboxOption<T>[]
  value: readonly T[]
  onChange: (next: T[]) => void
  searchPlaceholder?: string
  className?: string
  emptyMessage?: string
  showSelectedBadges?: boolean
  maxBadgesInTrigger?: number
  showClearButton?: boolean
  clearLabel?: string
}

export function CheckboxFilter<T extends string>({
  title,
  options,
  value,
  onChange,
  searchPlaceholder,
  className,
  emptyMessage = 'No results found.',
  showSelectedBadges = true,
  maxBadgesInTrigger = 2,
  showClearButton = true,
  clearLabel = 'Clear filters',
}: CheckboxFilterProps<T>) {
  const selectedCount = value.length

  const selectedOptions = React.useMemo(
    () => options.filter((o) => value.includes(o.value)),
    [options, value]
  )

  const visibleBadges = selectedOptions.slice(0, maxBadgesInTrigger)
  const rest = Math.max(0, selectedOptions.length - visibleBadges.length)

  const comboboxItems = React.useMemo(
    () => options.map((o) => ({ id: o.value, label: o.label, icon: o.icon, counts: o.counts })),
    [options]
  )

  const selectedItems = React.useMemo(
    () => comboboxItems.filter((i) => value.includes(i.id as T)),
    [comboboxItems, value]
  )

  return (
    <Combobox
      autoHighlight
      items={comboboxItems}
      multiple
      onValueChange={(items) => {
        if (Array.isArray(items)) {
          onChange(items.map((i: { id: string }) => i.id as T))
        }
      }}
      value={selectedItems}
    >
      <ComboboxTrigger
        render={
          <Button variant="outline" size="sm" className={cn('h-8 border-dashed', className)} />
        }
      >
        <PlusCircle className="mr-1 h-4 w-4" />
        {title}
        {selectedCount > 0 && (
          <>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
              {selectedCount}
            </Badge>
            <div className="hidden items-center space-x-1 lg:flex">
              {showSelectedBadges &&
                visibleBadges.map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {opt.label}
                  </Badge>
                ))}
              {rest > 0 && (
                <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                  +{rest}
                </Badge>
              )}
            </div>
          </>
        )}
      </ComboboxTrigger>
      <ComboboxPopup aria-label={`Filter ${title}`}>
        <div className="border-b p-2">
          <ComboboxInput
            className="rounded-md before:rounded-[calc(var(--radius-md)-1px)]"
            placeholder={searchPlaceholder ?? `Search ${title.toLowerCase()}...`}
            showTrigger={false}
            startAddon={<SearchIcon />}
          />
        </div>
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(option: CheckboxOption<T>) => {
            const Icon = option.icon
            return (
              <ComboboxItem key={option.value} value={option}>
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="size-4" />}
                  <span>{option.label}</span>
                </div>
              </ComboboxItem>
            )
          }}
        </ComboboxList>
        {showClearButton && value.length > 0 && (
          <div className="border-t p-1">
            <button
              className="flex w-full cursor-pointer items-center justify-center rounded-sm py-1.5 text-center text-muted-foreground text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => onChange([])}
              type="button"
            >
              {clearLabel}
            </button>
          </div>
        )}
      </ComboboxPopup>
    </Combobox>
  )
}
