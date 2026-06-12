import { Link } from '@adonisjs/inertia/react'
import React, { useState } from 'react'

import type { InertiaProps } from '~/types'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Form } from '~/components/ui/form'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import MinimalLayout from '~/layouts/minimal'
import { BadgeCheckIcon, MoveLeftIcon } from 'lucide-react'

type PageProps = InertiaProps<{}>

export default function ForgetPassword({}: PageProps) {
  const [sent, setSent] = useState(false)
  return sent ? (
    <div className="flex w-full max-w-sm flex-col items-center rounded border bg-background p-8 text-center">
      <BadgeCheckIcon className="mb-4 size-12 shrink-0" />
      <h3 className="text-xl font-bold tracking-tight">Check your email!</h3>
      <p className="mt-1 text-balance text-muted-foreground">
        We sent you a magic link to sign in to your account.
      </p>
      <Button className="mt-6 w-full">Open Email App</Button>
      <Button variant="outline" className="mt-2 w-full">
        Resend Email
      </Button>
    </div>
  ) : (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a link to reset your password.
        </CardDescription>
      </CardHeader>

      <CardPanel>
        <Form route="forget_passwords">
          {({ processing, wasSuccessful }) => (
            <div className="flex flex-col gap-4">
              <Field name="email">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input type="email" id="email" autoComplete="username" aria-label="Email" />
                <FieldError />
              </Field>

              <Button
                className="w-full mt-4"
                disabled={processing}
                type="submit"
                onSubmit={() => {
                  if (wasSuccessful) setSent(true)
                }}
              >
                Send Reset Email
              </Button>
            </div>
          )}
        </Form>
      </CardPanel>
      <div className="px-6 py-4 text-left text-sm text-muted-foreground flex gap-1">
        <MoveLeftIcon className="h-5 w-4" />
        Back to{' '}
        <Link route="session.create" className="text-foreground underline underline-offset-4">
          Login
        </Link>
      </div>
    </Card>
  )
}

ForgetPassword.layout = (page: React.ReactElement) => <MinimalLayout>{page}</MinimalLayout>
