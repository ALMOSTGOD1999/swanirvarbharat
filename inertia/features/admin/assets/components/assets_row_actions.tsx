import { EllipsisIcon, TrashIcon } from 'lucide-react'
import { useForm } from '@inertiajs/react'

import { DataTableRowActionsProps } from '~/components/data_table/data_table'
import { Menu, MenuItem, MenuPopup, MenuShortcut, MenuTrigger } from '~/components/ui/menu'
import { Button } from '~/components/ui/button'
import { Can } from '~/context/abilities_context'
import { urlFor } from '~/client'

type AssetRow = { id: string; type?: string; altText?: string; credit?: string; url?: string }

export function AssetsDataTableRowActions({ row }: DataTableRowActionsProps<AssetRow>) {
  const { delete: destroy } = useForm()

  const handleDelete = () => {
    if (
      confirm(
        'Are you sure you want to delete this asset? This will detach it from all posts, collections, and taxonomies.'
      )
    ) {
      destroy(urlFor('admin.assets.destroy', { id: row.original.id }))
    }
  }

  return (
    <Can I="delete" a="asset">
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
          <MenuItem className="text-destructive" onClick={handleDelete}>
            Delete
            <MenuShortcut>
              <TrashIcon size={16} />
            </MenuShortcut>
          </MenuItem>
        </MenuPopup>
      </Menu>
    </Can>
  )
}
