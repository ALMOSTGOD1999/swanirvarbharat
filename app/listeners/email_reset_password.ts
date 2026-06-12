import edge from 'edge.js'
import mail from '@adonisjs/mail/services/main'

import type { events } from '#generated/events'

export default class EmailResetPassword {
  async handle({ signedUrl, user }: InstanceType<typeof events.EmailPasswordReset>) {
    const html = await edge.render('emails/reset_password', { user, href: signedUrl })

    await mail.send((message) => {
      message.to(user.email).subject('[Swanirvarbharat] Reset your password').html(html)
    })
  }
}
