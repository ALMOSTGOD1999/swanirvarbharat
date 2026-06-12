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
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Separator } from '~/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Data } from '@generated/data'
import { useQuery } from '@tanstack/react-query'
import { api } from '~/client'

type PageProps = InertiaProps<{
  user: Data.User
}>

export default function AdminUsersShow({ user }: PageProps) {
  const roleQuery = useQuery(api.admin.roles.queryOptions({}, { staleTime: Infinity }))
  const roles = roleQuery.data?.roles ?? []
  return (
    <>
      <Head title={`User — ${user.username}`} />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link route="admin.users.index" />}>Users</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{user.username}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <div className="flex flex-col gap-8 py-4">
          {/* User Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">User Information</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-sm text-muted-foreground">Username</span>
                <p className="text-sm font-medium">{user.username}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email</span>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Created</span>
                <p className="text-sm font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Email Verified</span>
                <p className="text-sm font-medium">{user.emailVerifiedAt ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Role Management */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Change Role</h3>
            <Form route="admin.users.role" routeParams={{ id: user.id }}>
              {({ processing }) => (
                <div className="flex items-end gap-4">
                  <Field name="roleId" className="flex-1 max-w-xs">
                    <FieldLabel>Role</FieldLabel>
                    <Select name="roleId" defaultValue={user.roleId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError />
                  </Field>
                  <Button type="submit" disabled={processing}>
                    Update Role
                  </Button>
                </div>
              )}
            </Form>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              route="admin.users.index"
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </Main>
    </>
  )
}

AdminUsersShow.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
