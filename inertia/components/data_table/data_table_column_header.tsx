import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { Button } from '~/components/ui/button'
import { Menu, MenuItem, MenuPopup, MenuSeparator, MenuTrigger } from '~/components/ui/menu'

type DataTableColumnHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string
  /** The field name to sort by (e.g. 'title', 'publishedAt') */
  sortByField: string
  /** The current active sortBy value from URL params */
  currentSortBy: string
  /** The current active sortOrder from URL params */
  currentSortOrder: 'asc' | 'desc'
  /** Callback when sort changes */
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
}

export function DataTableColumnHeader({
  title,
  sortByField,
  currentSortBy,
  currentSortOrder,
  onSort,
  className,
}: DataTableColumnHeaderProps) {
  const isActive = currentSortBy === sortByField

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className={cn('-ml-3 h-8 data-[state=open]:bg-accent', isActive && 'text-primary')}
            />
          }
        >
          <span>{title}</span>
          {isActive ? (
            currentSortOrder === 'desc' ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            )
          ) : (
            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
          )}
        </MenuTrigger>
        <MenuPopup align="start">
          <MenuItem render={<button type="button" />} onClick={() => onSort(sortByField, 'asc')}>
            <ArrowUpIcon className="size-3.5 text-muted-foreground/70" />
            Asc
          </MenuItem>
          <MenuItem render={<button type="button" />} onClick={() => onSort(sortByField, 'desc')}>
            <ArrowDownIcon className="size-3.5 text-muted-foreground/70" />
            Desc
          </MenuItem>
          {isActive && (
            <>
              <MenuSeparator />
              <MenuItem
                render={<button type="button" />}
                onClick={() => onSort('publishedAt', 'desc')}
              >
                <ChevronsUpDownIcon className="size-3.5 text-muted-foreground/70" />
                Reset
              </MenuItem>
            </>
          )}
        </MenuPopup>
      </Menu>
    </div>
  )
}
