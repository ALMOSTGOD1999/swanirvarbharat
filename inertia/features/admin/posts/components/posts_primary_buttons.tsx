import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Can } from '~/context/abilities_context'

export function PostsPrimaryButtons() {
  return (
    <div>
      <Can I="create" a="post">
        <Button size="sm" render={<Link route="admin.posts.create" />}>
          New
        </Button>
      </Can>
    </div>
  )
}
