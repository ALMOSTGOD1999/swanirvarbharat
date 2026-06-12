import { compose } from '@adonisjs/core/helpers'

import { TopicSchema } from '#database/schema'
import { withID } from '#utils/with_id_mixin'

export default class Topic extends compose(TopicSchema, withID) {}
