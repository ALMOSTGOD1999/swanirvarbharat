import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Can } from '~/context/abilities_context'

export function SeriesPrimaryButtons() {
  return (
    <div>
      <Can I="create" a="series">
        <Button size="sm" render={<Link route="admin.series.create" />}>
          New
        </Button>
      </Can>
    </div>
  )
}
