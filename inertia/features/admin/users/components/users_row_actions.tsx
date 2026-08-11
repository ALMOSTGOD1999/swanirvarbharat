import { useState } from 'react'
import { EllipsisIcon, EyeIcon, TrashIcon } from 'lucide-react'
import { router } from '@inertiajs/react'

import { Data } from '@generated/data'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from '~/components/ui/alert-dialog'
import { DataTableRowActionsProps } from '~/components/data_table/data_table'
import { Menu, MenuItem, MenuPopup, MenuShortcut, MenuTrigger } from '~/components/ui/menu'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Link } from '@adonisjs/inertia/react'
import { Can } from '~/context/abilities_context'

export function UsersDataTableRowActions({ row }: DataTableRowActionsProps<Data.User>) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [masterKey, setMasterKey] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleDelete = () => {
    if (masterKey !== 'reallydelete') {
      return
    }
    setProcessing(true)
    router.delete(`/admin/users/${row.original.id}`, {
      data: { masterKey },
    })
  }

  return (
    <Can I="update" a="user">
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
            render={<Link route="admin.users.show" routeParams={{ id: row.original.id }} />}
          >
            View
            <MenuShortcut>
              <EyeIcon size={16} />
            </MenuShortcut>
          </MenuItem>

          <Can I="delete" a="user">
            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <AlertDialogTrigger
                render={
                  <MenuItem
                    className="text-destructive"
                    onSelect={(e) => {
                      e.preventDefault()
                      setDeleteOpen(true)
                    }}
                  >
                    Delete
                    <MenuShortcut>
                      <TrashIcon size={16} />
                    </MenuShortcut>
                  </MenuItem>
                }
              />
              <AlertDialogPopup>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete user?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <strong>{row.original.email}</strong> and all
                    associated data including documents, videos, and profile. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="px-6 py-4 space-y-2">
                  <Label htmlFor="masterKey">Type "reallydelete" to confirm</Label>
                  <Input
                    id="masterKey"
                    type="text"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    placeholder="reallydelete"
                    autoComplete="off"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogClose>Cancel</AlertDialogClose>
                  <Button
                    variant="destructive"
                    disabled={masterKey !== 'reallydelete' || processing}
                    onClick={handleDelete}
                  >
                    Delete permanently
                  </Button>
                </AlertDialogFooter>
              </AlertDialogPopup>
            </AlertDialog>
          </Can>
        </MenuPopup>
      </Menu>
    </Can>
  )
}
