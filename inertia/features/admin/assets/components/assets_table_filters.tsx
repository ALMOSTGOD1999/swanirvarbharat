import { format } from 'date-fns'
import { router } from '@inertiajs/react'
import { XIcon } from 'lucide-react'
import React from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { AssetTypes } from '#enums/asset'
import { urlFor } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { CheckboxFilter, type CheckboxOption } from '~/components/ui/checkbox-filter'
import { DateRangePicker } from '~/components/ui/date-range-picker'

type AssetsTableFiltersProps = {
  querySearch: string
  setQuerySearch: React.Dispatch<React.SetStateAction<string>>
  selectedTypes: string[]
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>
  dateFrom: string
  setDateFrom: React.Dispatch<React.SetStateAction<string>>
  dateTo: string
  setDateTo: React.Dispatch<React.SetStateAction<string>>
  limit: number
}

const typeOptions: CheckboxOption<string>[] = Object.values(AssetTypes).map((t) => ({
  label: t,
  value: t,
}))

export default function AssetsTableFilters({
  querySearch,
  setQuerySearch,
  selectedTypes,
  setSelectedTypes,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  limit,
}: AssetsTableFiltersProps) {
  const buildParams = React.useCallback(
    (overrides: Record<string, any> = {}) => {
      const params: Record<string, any> = {
        q: querySearch.length > 0 ? querySearch : undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page: 1,
        limit,
        ...overrides,
      }
      return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
    },
    [querySearch, selectedTypes, dateFrom, dateTo, limit]
  )

  const handleSubmit = React.useCallback((params: Record<string, any>) => {
    router.get(urlFor('admin.assets.index'), params, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
      only: ['assets', 'q', 'types', 'dateFrom', 'dateTo', 'sortBy', 'sortOrder'],
    })
  }, [])

  const debouncedSearch = useDebounceCallback(
    (value: string) =>
      handleSubmit(buildParams({ q: value.length > 0 ? value : undefined, page: 1 })),
    300
  )

  React.useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch])

  const isFiltered =
    querySearch.trim().length > 0 || selectedTypes.length > 0 || !!dateFrom || !!dateTo

  const clearAll = () => {
    debouncedSearch.cancel()
    setQuerySearch('')
    setSelectedTypes([])
    setDateFrom('')
    setDateTo('')
    handleSubmit({ page: 1, limit })
  }

  const handleSearch = (value: string) => {
    setQuerySearch(value)
    debouncedSearch(value)
  }

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    const fromStr = range.from ? format(range.from, 'yyyy-MM-dd') : ''
    const toStr = range.to ? format(range.to, 'yyyy-MM-dd') : ''
    setDateFrom(fromStr)
    setDateTo(toStr)
    handleSubmit(
      buildParams({
        dateFrom: fromStr || undefined,
        dateTo: toStr || undefined,
        page: 1,
      })
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search assets..."
          value={querySearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 w-full sm:w-56 lg:w-72"
          aria-label="Search assets"
        />

        <CheckboxFilter
          title="Type"
          options={typeOptions}
          value={selectedTypes}
          onChange={(next) => {
            setSelectedTypes(next)
            handleSubmit(buildParams({ types: next.length > 0 ? next : undefined, page: 1 }))
          }}
        />

        <DateRangePicker
          value={{
            from: dateFrom ? new Date(dateFrom) : undefined,
            to: dateTo ? new Date(dateTo) : undefined,
          }}
          onChange={handleDateRangeChange}
        />
      </div>

      {isFiltered && (
        <Button type="button" variant="ghost" onClick={clearAll} className="h-8 w-fit px-2 lg:px-3">
          Clear all filters
          <XIcon className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
