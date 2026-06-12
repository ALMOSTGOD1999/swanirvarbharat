import { format } from 'date-fns'
import { router } from '@inertiajs/react'
import { XIcon } from 'lucide-react'
import React from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useQuery } from '@tanstack/react-query'
import { States } from '#enums/states'
import { Difficulties } from '#enums/difficulties'
import { api, urlFor } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { CheckboxFilter, type CheckboxOption } from '~/components/ui/checkbox-filter'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import type { FilterOption } from '~/types'

type CoursesTableFiltersProps = {
  querySearch: string
  setQuerySearch: React.Dispatch<React.SetStateAction<string>>
  selectedStates: string[]
  setSelectedStates: React.Dispatch<React.SetStateAction<string[]>>
  selectedDifficulties: string[]
  setSelectedDifficulties: React.Dispatch<React.SetStateAction<string[]>>
  selectedOwnerIds: string[]
  setSelectedOwnerIds: React.Dispatch<React.SetStateAction<string[]>>
  selectedTaxonomyNames: string[]
  setSelectedTaxonomyNames: React.Dispatch<React.SetStateAction<string[]>>
  dateFrom: string
  setDateFrom: React.Dispatch<React.SetStateAction<string>>
  dateTo: string
  setDateTo: React.Dispatch<React.SetStateAction<string>>
  allOwners: FilterOption[]
  limit: number
}

const stateOptions: CheckboxOption<string>[] = Object.values(States).map((s) => ({
  label: s,
  value: s,
}))

const difficultyOptions: CheckboxOption<string>[] = Object.values(Difficulties).map((d) => ({
  label: d,
  value: d,
}))

export default function CoursesTableFilters({
  querySearch,
  setQuerySearch,
  selectedStates,
  setSelectedStates,
  selectedDifficulties,
  setSelectedDifficulties,
  selectedOwnerIds,
  setSelectedOwnerIds,
  selectedTaxonomyNames,
  setSelectedTaxonomyNames,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  allOwners,
  limit,
}: CoursesTableFiltersProps) {
  const taxonomyQuery = useQuery(
    api.admin.taxonomies.apiIndex.queryOptions({}, { staleTime: Infinity })
  )
  const allTaxonomies = taxonomyQuery.data ?? []

  const buildParams = React.useCallback(
    (overrides: Record<string, any> = {}) => {
      const params: Record<string, any> = {
        q: querySearch.length > 0 ? querySearch : undefined,
        states: selectedStates.length > 0 ? selectedStates : undefined,
        difficulties: selectedDifficulties.length > 0 ? selectedDifficulties : undefined,
        ownerIds: selectedOwnerIds.length > 0 ? selectedOwnerIds : undefined,
        taxonomyNames: selectedTaxonomyNames.length > 0 ? selectedTaxonomyNames : undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        page: 1,
        limit,
        ...overrides,
      }
      return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined))
    },
    [
      querySearch,
      selectedStates,
      selectedDifficulties,
      selectedOwnerIds,
      selectedTaxonomyNames,
      dateFrom,
      dateTo,
      limit,
    ]
  )

  const handleSubmit = React.useCallback((params: Record<string, any>) => {
    router.get(urlFor('admin.courses.index'), params, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
      only: [
        'courses',
        'q',
        'states',
        'difficulties',
        'ownerIds',
        'taxonomyNames',
        'dateFrom',
        'dateTo',
        'sortBy',
        'sortOrder',
      ],
    })
  }, [])

  const debouncedSearch = useDebounceCallback(
    (value: string) =>
      handleSubmit(buildParams({ q: value.length > 0 ? value : undefined, page: 1 })),
    300
  )

  React.useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch])

  const isFiltered =
    querySearch.trim().length > 0 ||
    selectedStates.length > 0 ||
    selectedDifficulties.length > 0 ||
    selectedOwnerIds.length > 0 ||
    selectedTaxonomyNames.length > 0 ||
    !!dateFrom ||
    !!dateTo

  const clearAll = () => {
    debouncedSearch.cancel()
    setQuerySearch('')
    setSelectedStates([])
    setSelectedDifficulties([])
    setSelectedOwnerIds([])
    setSelectedTaxonomyNames([])
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

  const ownerOptions: CheckboxOption<string>[] = allOwners.map((o) => ({
    label: o.name,
    value: o.id,
  }))

  const taxonomyOptions: CheckboxOption<string>[] = allTaxonomies.map((t) => ({
    label: t.name,
    value: t.name,
  }))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search courses..."
          value={querySearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 w-full sm:w-56 lg:w-72"
          aria-label="Search courses"
        />

        <CheckboxFilter
          title="State"
          options={stateOptions}
          value={selectedStates}
          onChange={(next) => {
            setSelectedStates(next)
            handleSubmit(buildParams({ states: next.length > 0 ? next : undefined, page: 1 }))
          }}
        />

        <CheckboxFilter
          title="Difficulty"
          options={difficultyOptions}
          value={selectedDifficulties}
          onChange={(next) => {
            setSelectedDifficulties(next)
            handleSubmit(buildParams({ difficulties: next.length > 0 ? next : undefined, page: 1 }))
          }}
        />

        {ownerOptions.length > 0 && (
          <CheckboxFilter
            title="Owner"
            options={ownerOptions}
            value={selectedOwnerIds}
            onChange={(next) => {
              setSelectedOwnerIds(next)
              handleSubmit(buildParams({ ownerIds: next.length > 0 ? next : undefined, page: 1 }))
            }}
          />
        )}

        {taxonomyOptions.length > 0 && (
          <CheckboxFilter
            title="Taxonomy"
            options={taxonomyOptions}
            value={selectedTaxonomyNames}
            onChange={(next) => {
              setSelectedTaxonomyNames(next)
              handleSubmit(
                buildParams({ taxonomyNames: next.length > 0 ? next : undefined, page: 1 })
              )
            }}
          />
        )}

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
