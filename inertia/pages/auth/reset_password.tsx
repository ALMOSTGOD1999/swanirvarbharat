import React from 'react'

import type { InertiaProps } from '~/types'
import MinimalLayout from '~/layouts/minimal'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Form } from '~/components/ui/form'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Button, buttonVariants } from '~/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { cn } from '~/lib/utils'

type PageProps = InertiaProps<{
  isSignatureValid: boolean
  email: string
  token: string
}>

export default function ResetPassword({ isSignatureValid, token, email }: PageProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Set a New Password</CardTitle>
        {isSignatureValid && (
          <CardDescription>
            Enter your new password and confirm it to set a new password.
          </CardDescription>
        )}
      </CardHeader>

      <CardPanel>
        {isSignatureValid ? (
          <Form route="reset_passwords">
            {({ processing }) => (
              <div className="flex flex-col gap-4">
                <Field name="token" className="hidden">
                  <FieldLabel htmlFor="token">Username</FieldLabel>
                  <Input
                    type="text"
                    id="token"
                    placeholder="Enter username"
                    value={token}
                    aria-label="Username"
                  />
                  <FieldError />
                </Field>

                <Field name="email" className="hidden">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    type="email"
                    id="email"
                    autoComplete="email"
                    placeholder="Enter email"
                    value={email}
                    aria-label="Email"
                  />
                  <FieldError />
                </Field>

                <Field name="password">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    placeholder="Enter password"
                    aria-label="Password"
                  />
                  <FieldError />
                </Field>

                <Field name="passwordConfirmation">
                  <FieldLabel htmlFor="passwordConfirmation">Confirm password</FieldLabel>
                  <Input
                    type="password"
                    id="passwordConfirmation"
                    autoComplete="new-password"
                    placeholder="Enter confirm password"
                    aria-label="Confirm Password"
                  />
                  <FieldError />
                </Field>

                <Button className="w-full mt-4" disabled={processing} type="submit">
                  Signup
                </Button>
              </div>
            )}
          </Form>
        ) : (
          <>
            <p className="text-error mb-6">Your password reset link is invalid or expired</p>

            <Link
              route="forget_passwords.index"
              className={cn(buttonVariants({ variant: 'destructive' }))}
            >
              Try again
            </Link>
          </>
        )}
      </CardPanel>
      <div className="px-6 py-4 text-center text-sm text-muted-foreground">
        Remembered password?{' '}
        <Link route="session.create" className="text-foreground underline underline-offset-4">
          Login
        </Link>
      </div>
    </Card>
  )
}

ResetPassword.layout = (page: React.ReactElement) => <MinimalLayout>{page}</MinimalLayout>
