import type { InertiaProps } from '~/types'
import React from 'react'
import AdminLayout from '~/layouts/admin'
import { Head } from '@inertiajs/react'
import { Header } from '~/components/header'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '~/components/ui/breadcrumb'
import { Main } from '~/components/main'
import Heading from '~/components/heading'
import { Form } from '~/components/ui/form'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

type PageProps = InertiaProps<{
  configs: Array<{
    id: string
    group: string
    key: string
    value: string | null
    type: string
    label: string | null
    description: string | null
  }>
}>

function Section({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

export default function AdminSettings({ configs }: PageProps) {
  const getConfig = (key: string) => configs.find((c) => c.key === key)?.value ?? ''

  return (
    <>
      <Head title="Settings" />
      <Header fixed>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Header>
      <Main>
        <Heading title="Settings" description="Configure your application settings." />

        <Form route="admin.settings.update">
          {({ processing }) => (
            <div className="flex flex-col gap-8 py-4">
              {/* AI Configuration */}
              <Section
                title="AI Configuration"
                description="Configure the AI provider for content generation features."
              >
                <Field name="provider">
                  <FieldLabel>Provider</FieldLabel>
                  <Select name="provider" defaultValue={getConfig('provider') || 'openai'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError />
                </Field>

                <Field name="api_key">
                  <FieldLabel htmlFor="api_key">API Key</FieldLabel>
                  <Input
                    type="password"
                    id="api_key"
                    name="api_key"
                    defaultValue={getConfig('api_key')}
                    placeholder="sk-..."
                    aria-label="API Key"
                  />
                  <FieldError />
                </Field>

                <Field name="base_url">
                  <FieldLabel htmlFor="base_url">Base URL (optional)</FieldLabel>
                  <Input
                    type="text"
                    id="base_url"
                    name="base_url"
                    defaultValue={getConfig('base_url')}
                    placeholder="https://api.openai.com/v1"
                    aria-label="Base URL"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty for default. Use for proxies or compatible APIs.
                  </p>
                  <FieldError />
                </Field>

                <Field name="model">
                  <FieldLabel htmlFor="model">Model (optional)</FieldLabel>
                  <Input
                    type="text"
                    id="model"
                    name="model"
                    defaultValue={getConfig('model')}
                    placeholder="gpt-4o"
                    aria-label="Model"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to use provider default (gpt-4o, claude-sonnet-4-20250514,
                    gemini-2.0-flash).
                  </p>
                  <FieldError />
                </Field>
              </Section>

              <Separator />

              {/* Actions */}
              <div className="flex items-center justify-end gap-4">
                <Button type="submit" disabled={processing}>
                  Save Settings
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Main>
    </>
  )
}

AdminSettings.layout = (page: React.ReactElement) => <AdminLayout>{page}</AdminLayout>
