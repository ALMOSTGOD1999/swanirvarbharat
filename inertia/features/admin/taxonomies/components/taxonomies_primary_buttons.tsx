import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'

export function TaxonomiesPrimaryButtons() {
  return (
    <div>
      <Button size="sm" render={<Link route="admin.taxonomies.create" />}>
        New
      </Button>
    </div>
  )
}
