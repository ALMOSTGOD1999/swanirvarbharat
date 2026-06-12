import { compose } from '@adonisjs/core/helpers'
import { computed, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

import { AccessLevelSchema } from '#database/schema'
import { withID } from '#utils/with_id_mixin'
import Course from '#models/course'

export default class AccessLevel extends compose(AccessLevelSchema, withID) {
  @computed()
  get sortOrderDisplay() {
    return this.sortOrder + 1
  }

  @hasMany(() => Course)
  declare courses: HasMany<typeof Course>
}
