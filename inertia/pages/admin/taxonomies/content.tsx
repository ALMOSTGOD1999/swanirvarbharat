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
import { GripVerticalIcon, TrashIcon } from 'lucide-react'
import { Data } from '@generated/data'

type PageProps = InertiaProps<{
  taxonomy: Data.Taxonomy
  posts: Data.Post[]
}>

export default function AdminTaxonomyContent({ taxonomy, posts }: PageProps) {
  const [localPosts, setLocalPosts] = React.useState<Data.Post[]>(posts)

  const removePost = (postId: string) => {
    setLocalPosts(localPosts.filter((p) => p.id !== postId))
  }

  return (
    <>
      <Head title={`Manage Content — ${taxonomy.name}`} />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link route="admin.taxonomies.index" />}>
                Taxonomies
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link route="admin.taxonomies.edit" routeParams={{ id: taxonomy.slug }} />}
              >
                {taxonomy.name}
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
        <Form route="admin.taxonomy_contents.update" routeParams={{ id: taxonomy.id }}>
          {({ processing }) => (
            <div className="flex flex-col gap-8 py-4">
              {/* Posts */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Associated Posts</h3>
                <p className="text-sm text-muted-foreground">
                  Posts linked to this taxonomy. Remove posts to unlink them.
                </p>
                {localPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No posts linked.</p>
                ) : (
                  <div className="space-y-2">
                    {localPosts.map((post, idx) => (
                      <div key={post.id} className="flex items-center gap-3 rounded-lg border p-3">
                        <GripVerticalIcon className="size-4 text-muted-foreground/50" />
                        <span className="flex-1 text-sm font-medium">{post.title}</span>
                        <span className="text-xs text-muted-foreground">{post.slug}</span>
                        <input type="hidden" name={`postIds[${idx}]`} value={post.id} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePost(post.id)}
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
                  route="admin.taxonomies.edit"
                  routeParams={{ id: taxonomy.slug }}
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

AdminTaxonomyContent.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
