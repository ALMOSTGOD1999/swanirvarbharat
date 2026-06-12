import { Link } from '@adonisjs/inertia/react'
import React from 'react'

import MinimalLayout from '~/layouts/minimal'
import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'

export default function Login() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your details below to login to your account</CardDescription>
      </CardHeader>

      <CardPanel>
        <Form route="session.store">
          {({ processing }) => (
            <div className="flex flex-col gap-4">
              <Field name="uid">
                <FieldLabel htmlFor="uid">Email/Username</FieldLabel>
                <Input
                  type="text"
                  id="uid"
                  autoComplete="username"
                  aria-label="Email or Username"
                />
                <FieldError />
              </Field>

              <Field name="password">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <FieldError />
              </Field>

              <Button className="w-full mt-4" disabled={processing} type="submit">
                Login
              </Button>
            </div>
          )}
        </Form>
      </CardPanel>
      <div className="px-6 py-4 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link route="new_account.create" className="text-foreground underline underline-offset-4">
          Signup
        </Link>
      </div>
    </Card>
  )
}

Login.layout = (page: React.ReactElement) => <MinimalLayout>{page}</MinimalLayout>
