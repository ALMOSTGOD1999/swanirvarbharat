import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import * as React from 'react'
import type { DropdownProps } from 'react-day-picker'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxPopup,
} from '~/components/ui/combobox'
import { Popover, PopoverPopup, PopoverTrigger } from '~/components/ui/popover'

type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

type DateRangePickerProps = {
  value: DateRange
  onChange: (range: DateRange) => void
  placeholder?: string
  className?: string
}

interface DropdownItem {
  disabled?: boolean
  label: string
  value: string
}

function CalendarDropdown(props: DropdownProps) {
  const { options, value, onChange, 'aria-label': ariaLabel } = props

  const items: DropdownItem[] =
    options?.map((option) => ({
      disabled: option.disabled,
      label: option.label,
      value: option.value.toString(),
    })) ?? []

  const selectedItem = items.find((item) => item.value === value?.toString())

  const handleValueChange = (newValue: DropdownItem | null) => {
    if (onChange && newValue) {
      const syntheticEvent = {
        target: { value: newValue.value },
      } as React.ChangeEvent<HTMLSelectElement>
      onChange(syntheticEvent)
    }
  }

  return (
    <Combobox
      aria-label={ariaLabel}
      autoHighlight
      items={items}
      onValueChange={handleValueChange}
      value={selectedItem}
    >
      <ComboboxInput
        className="**:[input]:w-0 **:[input]:flex-1"
        onFocus={(e) => e.currentTarget.select()}
      />
      <ComboboxPopup aria-label={ariaLabel}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: DropdownItem) => (
            <ComboboxItem disabled={item.disabled} key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxPopup>
    </Combobox>
  )
}

export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a date range',
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  const displayText = React.useMemo(() => {
    if (value.from && value.to) {
      return `${format(value.from, 'MMM d, yyyy')} – ${format(value.to, 'MMM d, yyyy')}`
    }
    if (value.from) {
      return `${format(value.from, 'MMM d, yyyy')} – End`
    }
    return placeholder
  }, [value, placeholder])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              'h-8 w-full justify-start text-left font-normal sm:w-[260px]',
              !value.from && 'text-muted-foreground',
              className
            )}
          />
        }
      >
        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
        {displayText}
      </PopoverTrigger>
      <PopoverPopup align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          captionLayout="dropdown"
          components={{ Dropdown: CalendarDropdown }}
          defaultMonth={value.from}
          selected={value.from && value.to ? { from: value.from, to: value.to } : undefined}
          onSelect={(range) => {
            onChange({
              from: range?.from,
              to: range?.to,
            })
            if (range?.from && range?.to) {
              setOpen(false)
            }
          }}
          numberOfMonths={2}
          startMonth={new Date(1900, 0)}
          endMonth={new Date()}
        />
      </PopoverPopup>
    </Popover>
  )
}
