import { format } from 'date-fns'
import { router } from '@inertiajs/react'
import { XIcon } from 'lucide-react'
import React from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useQuery } from '@tanstack/react-query'
import { PostTypes } from '#enums/posts'
import { States } from '#enums/states'
import { api, urlFor } from '~/client'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { CheckboxFilter, type CheckboxOption } from '~/components/ui/checkbox-filter'
import { DateRangePicker } from '~/components/ui/date-range-picker'
import type { FilterOption } from '~/types'

type PostsTableFiltersProps = {
  querySearch: string
  setQuerySearch: React.Dispatch<React.SetStateAction<string>>
  selectedTypes: string[]
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>
  selectedStates: string[]
  setSelectedStates: React.Dispatch<React.SetStateAction<string[]>>
  selectedAuthorIds: string[]
  setSelectedAuthorIds: React.Dispatch<React.SetStateAction<string[]>>
  selectedTaxonomyNames: string[]
  setSelectedTaxonomyNames: React.Dispatch<React.SetStateAction<string[]>>
  dateFrom: string
  setDateFrom: React.Dispatch<React.SetStateAction<string>>
  dateTo: string
  setDateTo: React.Dispatch<React.SetStateAction<string>>
  allAuthors: FilterOption[]
  limit: number
}

const postTypeOptions: CheckboxOption<string>[] = Object.values(PostTypes).map((t) => ({
  label: t,
  value: t,
}))

const stateOptions: CheckboxOption<string>[] = Object.values(States).map((s) => ({
  label: s,
  value: s,
}))

export default function PostsTableFilters({
  querySearch,
  setQuerySearch,
  selectedTypes,
  setSelectedTypes,
  selectedStates,
  setSelectedStates,
  selectedAuthorIds,
  setSelectedAuthorIds,
  selectedTaxonomyNames,
  setSelectedTaxonomyNames,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  allAuthors,
  limit,
}: PostsTableFiltersProps) {
  const taxonomyQuery = useQuery(
    api.admin.taxonomies.apiIndex.queryOptions({}, { staleTime: Infinity })
  )
  const allTaxonomies = taxonomyQuery.data ?? []
  const buildParams = React.useCallback(
    (overrides: Record<string, any> = {}) => {
      const params: Record<string, any> = {
        q: querySearch.length > 0 ? querySearch : undefined,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        states: selectedStates.length > 0 ? selectedStates : undefined,
        authorIds: selectedAuthorIds.length > 0 ? selectedAuthorIds : undefined,
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
      selectedTypes,
      selectedStates,
      selectedAuthorIds,
      selectedTaxonomyNames,
      dateFrom,
      dateTo,
      limit,
    ]
  )

  const handleSubmit = React.useCallback((params: Record<string, any>) => {
    router.get(urlFor('admin.posts.index'), params, {
      preserveScroll: true,
      preserveState: true,
      replace: true,
      only: [
        'posts',
        'q',
        'types',
        'states',
        'authorIds',
        'taxonomyNames',
        'dateFrom',
        'dateTo',
        'sort',
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
    selectedTypes.length > 0 ||
    selectedStates.length > 0 ||
    selectedAuthorIds.length > 0 ||
    selectedTaxonomyNames.length > 0 ||
    !!dateFrom ||
    !!dateTo

  const clearAll = () => {
    debouncedSearch.cancel()
    setQuerySearch('')
    setSelectedTypes([])
    setSelectedStates([])
    setSelectedAuthorIds([])
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

  const authorOptions: CheckboxOption<string>[] = allAuthors.map((a) => ({
    label: a.name,
    value: a.id,
  }))

  const taxonomyOptions: CheckboxOption<string>[] = allTaxonomies.map((t) => ({
    label: t.name,
    value: t.name,
  }))

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Search posts..."
          value={querySearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="h-8 w-full sm:w-56 lg:w-72"
          aria-label="Search posts"
        />

        <CheckboxFilter
          title="Type"
          options={postTypeOptions}
          value={selectedTypes}
          onChange={(next) => {
            setSelectedTypes(next)
            handleSubmit(buildParams({ types: next.length > 0 ? next : undefined, page: 1 }))
          }}
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

        {authorOptions.length > 0 && (
          <CheckboxFilter
            title="Author"
            options={authorOptions}
            value={selectedAuthorIds}
            onChange={(next) => {
              setSelectedAuthorIds(next)
              handleSubmit(buildParams({ authorIds: next.length > 0 ? next : undefined, page: 1 }))
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
