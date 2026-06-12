import { EditIcon, EllipsisIcon, TrashIcon } from 'lucide-react'

import { DataTableRowActionsProps } from '~/components/data_table/data_table'
import { Menu, MenuItem, MenuPopup, MenuShortcut, MenuTrigger } from '~/components/ui/menu'
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Can } from '~/context/abilities_context'

type RoleRow = { id: string; name: string; description?: string | null; createdAt?: string | null }

const PROTECTED_ROLES = ['admin', 'user']

export function RolesDataTableRowActions({ row }: DataTableRowActionsProps<RoleRow>) {
  const isProtected = PROTECTED_ROLES.includes(row.original.name.toLowerCase())

  return (
    <Can I="update" a="role">
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
            render={<Link route="admin.roles.edit" routeParams={{ id: row.original.id }} />}
          >
            Edit
            <MenuShortcut>
              <EditIcon size={16} />
            </MenuShortcut>
          </MenuItem>

          {!isProtected && (
            <Can I="delete" a="role">
              <MenuItem
                className="text-destructive"
                render={<Link route="admin.roles.destroy" routeParams={{ id: row.original.id }} />}
              >
                Delete
                <MenuShortcut>
                  <TrashIcon size={16} />
                </MenuShortcut>
              </MenuItem>
            </Can>
          )}
        </MenuPopup>
      </Menu>
    </Can>
  )
}
