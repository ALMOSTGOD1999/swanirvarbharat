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
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Separator } from '~/components/ui/separator'
import { GripVerticalIcon, PlusIcon, TrashIcon, BookOpenIcon } from 'lucide-react'

type ModulePost = {
  id: string
  title: string
  slug: string
}

type CourseModule = {
  id: string
  name: string
  notes: string | null
  state: string
  sortOrder: number
  posts: ModulePost[]
}

type PageProps = InertiaProps<{
  course: any
  modules: CourseModule[]
}>

export default function AdminCourseShow({ course, modules }: PageProps) {
  const [localModules, setLocalModules] = React.useState<CourseModule[]>(modules)
  const [newModuleName, setNewModuleName] = React.useState('')

  const addModule = () => {
    const name = newModuleName.trim() || `Module ${localModules.length + 1}`
    setLocalModules([
      ...localModules,
      {
        id: `-${Date.now()}`,
        name,
        notes: null,
        state: 'Draft',
        sortOrder: localModules.length,
        posts: [],
      },
    ])
    setNewModuleName('')
  }

  const removeModule = (moduleId: string) => {
    setLocalModules(localModules.filter((m) => m.id !== moduleId))
  }

  const removePostFromModule = (moduleId: string, postId: string) => {
    setLocalModules(
      localModules.map((m) =>
        m.id === moduleId ? { ...m, posts: m.posts.filter((p) => p.id !== postId) } : m
      )
    )
  }

  return (
    <>
      <Head title={`Manage Content — ${course.name}`} />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link route="admin.courses.index" />}>Courses</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link route="admin.courses.edit" routeParams={{ id: course.id }} />}
              >
                {course.name}
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
        <div className="flex flex-col gap-8 py-4">
          {/* Course Info */}
          <div className="flex items-center gap-4">
            {course.asset?.url ? (
              <img
                src={course.asset.url}
                alt={course.asset.altText || ''}
                className="h-16 w-24 rounded object-cover"
              />
            ) : (
              <div className="h-16 w-24 rounded bg-muted flex items-center justify-center">
                <BookOpenIcon className="size-6 text-muted-foreground/50" />
              </div>
            )}
            <div>
              <h2 className="text-lg font-semibold">{course.name}</h2>
              <p className="text-sm text-muted-foreground">
                {course.state} · {course.difficulty} · {localModules.length} module
                {localModules.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          <Separator />

          {/* Modules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Modules</h3>
                <p className="text-sm text-muted-foreground">
                  Organize lessons into modules. Add posts to each module.
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addModule}>
                <PlusIcon className="mr-1 size-4" />
                Add Module
              </Button>
            </div>

            {localModules.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No modules yet. Add a module to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {localModules.map((mod, moduleIdx) => (
                  <div key={mod.id} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <GripVerticalIcon className="size-4 text-muted-foreground/50" />
                      <span className="text-xs font-medium text-muted-foreground">
                        {moduleIdx + 1}
                      </span>
                      <input type="hidden" name={`modules[${moduleIdx}].id`} value={mod.id} />
                      <Input
                        type="text"
                        name={`modules[${moduleIdx}].name`}
                        defaultValue={mod.name}
                        className="flex-1"
                        aria-label="Module name"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeModule(mod.id)}
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                    {mod.posts.length > 0 && (
                      <div className="space-y-1 pl-8">
                        {mod.posts.map((post, postIdx) => (
                          <div
                            key={post.id}
                            className="flex items-center gap-2 rounded border p-2 text-sm"
                          >
                            <input
                              type="hidden"
                              name={`modules[${moduleIdx}].postIds[${postIdx}]`}
                              value={post.id}
                            />
                            <span className="flex-1">{post.title}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePostFromModule(mod.id, post.id)}
                            >
                              <TrashIcon className="size-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    {mod.posts.length === 0 && (
                      <p className="text-xs text-muted-foreground italic pl-8">
                        No lessons in this module yet.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              route="admin.courses.edit"
              routeParams={{ id: course.id }}
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Back to Edit
            </Link>
          </div>
        </div>
      </Main>
    </>
  )
}

AdminCourseShow.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
