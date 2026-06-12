import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Can } from '~/context/abilities_context'

export function PlaylistPrimaryButtons() {
  return (
    <div>
      <Can I="create" a="playlist">
        <Button size="sm" render={<Link route="admin.playlists.create" />}>
          New
        </Button>
      </Can>
    </div>
  )
}
