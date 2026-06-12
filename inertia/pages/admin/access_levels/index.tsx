import type { Data } from '@generated/data'
import { Head } from '@inertiajs/react'
import React, { useState } from 'react'
import { Header } from '~/components/header'
import Heading from '~/components/heading'
import { Main } from '~/components/main'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Switch } from '~/components/ui/switch'
import { GripVerticalIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Can } from '~/context/abilities_context'
import AdminLayout from '~/layouts/admin'
import type { InertiaProps } from '~/types'

type PageProps = InertiaProps<{
  accessLevels: Data.AccessLevel[]
}>

export default function AdminAccessLevels({ accessLevels }: PageProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editColor, setEditColor] = useState('#000000')
  const [editIsDefault, setEditIsDefault] = useState(false)

  const startEdit = (al: Data.AccessLevel) => {
    setEditingId(al.id)
    setEditName(al.name)
    setEditColor(al.color)
    setEditIsDefault(al.isDefault)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditColor('#000000')
    setEditIsDefault(false)
  }

  return (
    <>
      <Head title="Access Levels" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Access Levels</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading
          title="Access Levels"
          description="Manage course access levels for monetization and permissions."
        />

        <div className="flex flex-col gap-6 py-4">
          {/* Add new access level */}
          <Can I="create" a="accessLevel">
            <div className="rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3">Add Access Level</h3>
              <Form route="admin.access_levels.store">
                {({ processing }) => (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-end gap-3">
                      <Field name="name" className="flex-1">
                        <FieldLabel htmlFor="newName">Name</FieldLabel>
                        <Input
                          type="text"
                          id="newName"
                          name="name"
                          required
                          minLength={1}
                          maxLength={50}
                          placeholder="e.g. Premium"
                        />
                        <FieldError />
                      </Field>
                      <Field name="color">
                        <FieldLabel htmlFor="newColor">Color</FieldLabel>
                        <Input
                          type="color"
                          id="newColor"
                          name="color"
                          defaultValue="#6366f1"
                          className="h-9 w-16 p-1"
                        />
                        <FieldError />
                      </Field>
                      <Field name="isDefault">
                        <div className="flex items-center gap-2">
                          <Switch id="newIsDefault" name="isDefault" />
                          <FieldLabel htmlFor="newIsDefault">Default</FieldLabel>
                        </div>
                        <FieldError />
                      </Field>
                      <Button type="submit" size="sm" disabled={processing}>
                        <PlusIcon className="mr-1 size-3.5" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </Form>
            </div>
          </Can>

          {/* List of access levels */}
          <div className="space-y-2">
            {accessLevels.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No access levels configured.</p>
            ) : (
              accessLevels.map((al) => (
                <div key={al.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <GripVerticalIcon className="size-4 text-muted-foreground/50" />
                  <div
                    className="size-4 rounded-full border"
                    style={{ backgroundColor: al.color }}
                  />
                  {editingId === al.id ? (
                    <Form route="admin.access_levels.update" routeParams={{ id: al.id }}>
                      {({ processing }) => (
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            type="text"
                            name="name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8 w-48"
                            aria-label="Access level name"
                          />
                          <Input
                            type="color"
                            name="color"
                            value={editColor}
                            onChange={(e) => setEditColor(e.target.value)}
                            className="h-8 w-12 p-0.5"
                            aria-label="Access level color"
                          />
                          <div className="flex items-center gap-1.5">
                            <Switch
                              name="isDefault"
                              checked={editIsDefault}
                              onCheckedChange={setEditIsDefault}
                            />
                            <span className="text-xs text-muted-foreground">Default</span>
                          </div>
                          <Button type="submit" size="sm" variant="ghost" disabled={processing}>
                            Save
                          </Button>
                          <Button type="button" size="sm" variant="ghost" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </Form>
                  ) : (
                    <>
                      <span className="flex-1 text-sm font-medium">{al.name}</span>
                      {al.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                      <Button type="button" size="sm" variant="ghost" onClick={() => startEdit(al)}>
                        Edit
                      </Button>
                      <Can I="delete" a="accessLevel">
                        <Form route="admin.access_levels.destroy" routeParams={{ id: al.id }}>
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </Form>
                      </Can>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </Main>
    </>
  )
}

AdminAccessLevels.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
