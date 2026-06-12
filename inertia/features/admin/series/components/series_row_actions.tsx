import { EllipsisIcon, TrashIcon } from 'lucide-react'

import { Data } from '@generated/data'

import { DataTableRowActionsProps } from '~/components/data_table/data_table'
import { Menu, MenuItem, MenuPopup, MenuShortcut, MenuTrigger } from '~/components/ui/menu'
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Can } from '~/context/abilities_context'

export function SeriesDataTableRowActions({ row }: DataTableRowActionsProps<Data.Series>) {
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button variant="ghost" className="flex h-8 w-8 p-0 border-0 data-[state=open]:bg-muted">
            <EllipsisIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        }
      />

      <MenuPopup align="end" className="w-40">
        <MenuItem render={<Link route="admin.series.edit" routeParams={{ id: row.original.id }} />}>
          Edit
        </MenuItem>

        <Can I="delete" a="series">
          <MenuItem
            className="text-destructive"
            render={<Link route="admin.series.destroy" routeParams={{ id: row.original.id }} />}
          >
            Delete
            <MenuShortcut>
              <TrashIcon size={16} />
            </MenuShortcut>
          </MenuItem>
        </Can>
      </MenuPopup>
    </Menu>
  )
}
