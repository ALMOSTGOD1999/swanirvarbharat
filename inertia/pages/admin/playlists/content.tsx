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
import { GripVerticalIcon, TrashIcon, MusicIcon } from 'lucide-react'

type PlaylistPost = {
  id: string
  title: string
  slug: string
  sortOrder: number
}

type PageProps = InertiaProps<{
  playlist: any
  posts: PlaylistPost[]
}>

export default function AdminPlaylistContent({ playlist, posts }: PageProps) {
  const [localPosts, setLocalPosts] = React.useState<PlaylistPost[]>(posts)

  const removePost = (postId: string) => {
    setLocalPosts(localPosts.filter((p) => p.id !== postId))
  }

  return (
    <>
      <Head title={`Manage Content — ${playlist.name}`} />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link route="admin.playlists.index" />}>
                Playlists
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link route="admin.playlists.edit" routeParams={{ id: playlist.id }} />}
              >
                {playlist.name}
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
        <Form route="admin.playlists.update" routeParams={{ id: playlist.id }}>
          {({ processing }) => (
            <div className="flex flex-col gap-8 py-4">
              {/* Playlist Info */}
              <div className="flex items-center gap-4">
                {playlist.asset?.url ? (
                  <img
                    src={playlist.asset.url}
                    alt={playlist.asset.altText || ''}
                    className="h-16 w-24 rounded object-cover"
                  />
                ) : (
                  <div className="h-16 w-24 rounded bg-muted flex items-center justify-center">
                    <MusicIcon className="size-6 text-muted-foreground/50" />
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-semibold">{playlist.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {playlist.state} · {localPosts.length} post{localPosts.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Posts */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Posts</h3>
                  <p className="text-sm text-muted-foreground">
                    Posts in this playlist. Add or remove posts to organize content.
                  </p>
                </div>

                {localPosts.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    No posts yet. Add posts to get started.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {localPosts.map((post, idx) => (
                      <div key={post.id} className="flex items-center gap-3 rounded-lg border p-3">
                        <GripVerticalIcon className="size-4 text-muted-foreground/50" />
                        <span className="flex-1 text-sm font-medium">{post.title}</span>
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
                  route="admin.playlists.edit"
                  routeParams={{ id: playlist.id }}
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

AdminPlaylistContent.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
