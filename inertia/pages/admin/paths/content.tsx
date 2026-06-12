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
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Separator } from '~/components/ui/separator'
import { GripVerticalIcon, TrashIcon, MapIcon } from 'lucide-react'

type PathCourse = {
  id: string
  name: string
  slug: string
  sortOrder: number
}

type PageProps = InertiaProps<{
  path: any
  courses: PathCourse[]
}>

export default function AdminPathContent({ path, courses }: PageProps) {
  const [localCourses, setLocalCourses] = React.useState<PathCourse[]>(courses)

  const removeCourse = (courseId: string) => {
    setLocalCourses(localCourses.filter((c) => c.id !== courseId))
  }

  return (
    <>
      <Head title={`Manage Content — ${path.name}`} />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link route="admin.paths.index" />}>Paths</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link route="admin.paths.edit" routeParams={{ id: path.id }} />}
              >
                {path.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Content</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Form route="admin.paths.update" routeParams={{ id: path.id }}>
          {({ processing }) => (
            <div className="flex flex-col gap-8 py-4">
              {/* Path Info */}
              <div className="flex items-center gap-4">
                {path.asset?.url ? (
                  <img
                    src={path.asset.url}
                    alt={path.asset.altText || ''}
                    className="h-16 w-24 rounded object-cover"
                  />
                ) : (
                  <div className="h-16 w-24 rounded bg-muted flex items-center justify-center">
                    <MapIcon className="size-6 text-muted-foreground/50" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold">{path.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {path.state} · {localCourses.length} course
                    {localCourses.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Courses */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Courses</h3>
                  <p className="text-sm text-muted-foreground">
                    Courses in this learning path. Add or remove courses to organize the path.
                  </p>
                </div>

                {localCourses.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No courses yet. Add courses to get started.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {localCourses.map((course, idx) => (
                      <div
                        key={course.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <GripVerticalIcon className="size-4 text-muted-foreground/50" />
                        <span className="flex-1 text-sm font-medium">{course.name}</span>
                        <input type="hidden" name={`courseIds[${idx}]`} value={course.id} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCourse(course.id)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Link
                  route="admin.paths.edit"
                  routeParams={{ id: path.id }}
                  className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Back to Edit
                </Link>
                <Button type="submit" disabled={processing}>
                  Save Content
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Main>
    </>
  )
}

AdminPathContent.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
