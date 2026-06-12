import edge from 'edge.js'
import mail from '@adonisjs/mail/services/main'

import type { events } from '#generated/events'

export default class EmailVerifyEmail {
  async handle({ signedUrl, user }: InstanceType<typeof events.EmailVerifyEmail>) {
    const html = await edge.render('emails/verify_email', { user, href: signedUrl })

    await mail.send((message) => {
      message
        .to(user.email)
        .subject('[Swanirvarbharat] Verify your email address')
        .html(html)
    })
  }
}
