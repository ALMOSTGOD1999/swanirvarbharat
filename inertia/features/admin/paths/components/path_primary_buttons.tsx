import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Can } from '~/context/abilities_context'

export function PathPrimaryButtons() {
  return (
    <div>
      <Can I="create" a="path">
        <Button size="sm" render={<Link route="admin.paths.create" />}>
          New
        </Button>
      </Can>
    </div>
  )
}
