import { EditIcon, EllipsisIcon, ListIcon, PlusIcon, TrashIcon } from 'lucide-react'

import { Data } from '@generated/data'

import { DataTableRowActionsProps } from '~/components/data_table/data_table'
import { Menu, MenuItem, MenuPopup, MenuShortcut, MenuTrigger } from '~/components/ui/menu'
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Can } from '~/context/abilities_context'

export function TaxonomiesDataTableRowActions({ row }: DataTableRowActionsProps<Data.Taxonomy>) {
  const taxonomy = row.original
  const isRoot = !taxonomy.parentId

  return (
    <Can I="update" a="taxonomy">
      <Menu>
        <MenuTrigger
          render={
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 border-0 data-[state=open]:bg-muted"
            >
              <EllipsisIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          }
        />

        <MenuPopup align="end" className="w-40">
          <MenuItem
            render={<Link route="admin.taxonomies.edit" routeParams={{ id: taxonomy.slug }} />}
          >
            Edit
            <MenuShortcut>
              <EditIcon size={16} />
            </MenuShortcut>
          </MenuItem>

          <MenuItem
            render={<Link route="admin.taxonomy_contents.edit" routeParams={{ id: taxonomy.id }} />}
          >
            Manage Content
            <MenuShortcut>
              <ListIcon size={16} />
            </MenuShortcut>
          </MenuItem>

          {isRoot && (
            <MenuItem render={<Link route="admin.taxonomies.create" />}>
              Add Child
              <MenuShortcut>
                <PlusIcon size={16} />
              </MenuShortcut>
            </MenuItem>
          )}

          <Can I="delete" a="taxonomy">
            <MenuItem
              className="text-destructive"
              render={<Link route="admin.taxonomies.destroy" routeParams={{ id: taxonomy.id }} />}
            >
              Delete
              <MenuShortcut>
                <TrashIcon size={16} />
              </MenuShortcut>
            </MenuItem>
          </Can>
        </MenuPopup>
      </Menu>
    </Can>
  )
}
