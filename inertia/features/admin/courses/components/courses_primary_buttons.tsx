import { Button } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { Can } from '~/context/abilities_context'

export function CoursesPrimaryButtons() {
  return (
    <div>
      <Can I="create" a="course">
        <Button size="sm" render={<Link route="admin.courses.create" />}>
          New
        </Button>
      </Can>
    </div>
  )
}
