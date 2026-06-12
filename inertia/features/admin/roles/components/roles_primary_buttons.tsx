import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'

export function RolesPrimaryButtons() {
  return (
    <div>
      <Button size="sm" render={<Link route="admin.roles.create" />}>
        New
      </Button>
    </div>
  )
}
