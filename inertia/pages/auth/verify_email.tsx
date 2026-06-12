import { Link } from '@adonisjs/inertia/react'
import { router } from '@inertiajs/react'
import React from 'react'

import MinimalLayout from '~/layouts/minimal'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Field, FieldLabel } from '~/components/ui/field'

export default function VerifyEmail() {
  const [email, setEmail] = React.useState('')
  const [sent, setSent] = React.useState(false)

  const handleResend = (e: React.FormEvent) => {
    e.preventDefault()
    router.post('/verify-email/resend', { email })
    setSent(true)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="border-b">
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          We've sent a verification link to your email address. Please check your inbox and click the
          link to activate your account.
        </CardDescription>
      </CardHeader>

      <CardPanel>
        <div className="flex flex-col gap-6">
          {!sent ? (
            <form onSubmit={handleResend} className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Enter your email below to resend.
              </p>
              <Field name="email">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  aria-label="Email"
                  required
                />
              </Field>
              <Button type="submit" className="w-full">
                Resend Verification Email
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                If the email address is registered, a new verification link has been sent.
              </p>
            </div>
          )}

          <div className="border-t pt-4 text-center text-sm text-muted-foreground">
            Already verified?{' '}
            <Link route="session.create" className="text-foreground underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
      </CardPanel>
    </Card>
  )
}

VerifyEmail.layout = (page: React.ReactElement) => <MinimalLayout>{page}</MinimalLayout>
