import router from '@adonisjs/core/services/router'
import mail from '@adonisjs/mail/services/main'
import edge from 'edge.js'

import type { events } from '#generated/events'

import env from '#start/env'
import { appUrl } from '#config/app'

export default class EmailNewDevice {
  async handle({ user, sessionLog }: InstanceType<typeof events.EmailNewDevice>) {
    // TODO)) add setting/account route instead when ready
    const href = router.urlBuilder.urlFor('home', { section: 'account' }, { prefixUrl: appUrl })
    const html = await edge.render('emails/new_device', { user, log: sessionLog, href })

    await mail.send((mailer) => {
      mailer
        .to(user.email)
        .subject(`We noticed a new sign in to your ${env.get('VITE_APP_NAME')} account`)
        .html(html)
    })
  }
}
