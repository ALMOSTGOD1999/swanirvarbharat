import type { InertiaProps } from '~/types'
import React from 'react'
import AdminLayout from '~/layouts/admin'
import { Head } from '@inertiajs/react'
import { Header } from '~/components/header'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Main } from '~/components/main'
import { Form } from '~/components/ui/form'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Textarea } from '~/components/ui/textarea'
import { Separator } from '~/components/ui/separator'

type RoleFormData = {
  id: string
  name: string
  description?: string | null
  createdAt?: string | null
  usersCount?: number
}

type PageProps = InertiaProps<{
  role?: RoleFormData
}>

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

export default function AdminRolesForm({ role }: PageProps) {
  const isEdit = !!role
  const title = isEdit ? 'Edit Role' : 'Create Role'

  return (
    <>
      <Head title={title} />
      <Header>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link route="admin.roles.index" />}>Roles</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Form
          route={isEdit ? 'admin.roles.update' : 'admin.roles.create'}
          routeParams={isEdit ? { id: role.id } : {}}
        >
          {({ processing }) => (
            <div className="flex flex-col gap-8 py-4">
              {/* Content */}
              <Section title="Content" description="Name and description of the role">
                <Field name="name">
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    type="text"
                    id="name"
                    required
                    minLength={3}
                    maxLength={50}
                    defaultValue={role?.name}
                    placeholder="e.g. moderator, editor"
                    aria-label="Name"
                  />
                  <FieldError />
                </Field>
                <Field name="description">
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    rows={3}
                    maxLength={255}
                    defaultValue={role?.description ?? ''}
                    placeholder="What does this role do?"
                  />
                  <FieldError />
                </Field>
              </Section>

              {isEdit && role?.usersCount !== undefined && (
                <>
                  <Separator />
                  <Section title="Info" description="Role usage information">
                    <p className="text-sm text-muted-foreground">
                      This role is assigned to <strong>{role.usersCount}</strong> user
                      {role.usersCount !== 1 ? 's' : ''}.
                    </p>
                  </Section>
                </>
              )}

              <Separator />

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Button variant="ghost" render={<Link route="admin.roles.index">Cancel</Link>} />
                <Button type="submit" disabled={processing}>
                  {isEdit ? 'Update Role' : 'Create Role'}
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Main>
    </>
  )
}

AdminRolesForm.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
