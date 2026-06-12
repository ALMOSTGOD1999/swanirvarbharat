import emitter from '@adonisjs/core/services/emitter'

import { events } from '#generated/events'
import { listeners } from '#generated/listeners'

emitter.on(events.EmailNewDevice, [listeners.EmailNewDevice])
emitter.on(events.EmailPasswordReset, [listeners.EmailResetPassword])
emitter.on(events.EmailVerifyEmail, [listeners.EmailVerifyEmail])
