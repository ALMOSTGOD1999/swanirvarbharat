import { Link } from '@adonisjs/inertia/react'
import { Head } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import type React from 'react'

import DefaultLayout from '~/layouts/default'
import { Form } from '~/components/ui/form'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Select } from '~/components/ui/select'
import { Button, buttonVariants } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import type { InertiaProps } from '~/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  discussion?: Data.Discussion
  taxonomies: Data.Taxonomy[]
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

export default function DiscussionsForm({ discussion, taxonomies }: PageProps) {
  const isEditing = !!discussion

  return (
    <>
      <Head title={isEditing ? 'Edit Discussion' : 'New Discussion'} />
      <div className="px-5 py-10">
        <div className="container mx-auto max-w-4xl space-y-6">
          {/* Back link */}
          <Link
            href={isEditing ? `/forum/${discussion?.slug}` : '/forum'}
            className={buttonVariants({ size: 'sm', variant: 'outline' })}
          >
            <ArrowLeft className="size-4 mr-1" />
            Back
          </Link>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isEditing ? 'Edit Discussion' : 'New Discussion'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isEditing
                ? 'Update your discussion details.'
                : 'Start a new discussion with the community.'}
            </p>
          </div>

          <Separator />

          <Form
            route={isEditing ? 'discussions.update' : 'discussions.store'}
            routeParams={isEditing ? { slug: discussion!.slug } : undefined}
          >
            <Section title="Title" description="A clear, descriptive title for your discussion.">
              <Field name="title">
                <FieldLabel>Title</FieldLabel>
                <Input
                  defaultValue={discussion?.title ?? ''}
                  placeholder="What's your discussion about?"
                  aria-label="Discussion title"
                />
                <FieldError />
              </Field>
            </Section>

            <Separator />

            <Section title="Content" description="The body of your discussion.">
              <Field name="body">
                <FieldLabel>Body</FieldLabel>
                <Textarea
                  defaultValue={discussion?.body ?? ''}
                  placeholder="Elaborate on your discussion topic..."
                  rows={8}
                />
                <FieldError />
              </Field>
            </Section>

            <Separator />

            <Section title="Topic" description="Categorize your discussion (optional).">
              <Field name="taxonomyId">
                <FieldLabel>Topic</FieldLabel>
                <Select defaultValue={discussion?.taxonomyId ?? ''}>
                  <option value="">Select a topic...</option>
                  {taxonomies.map((taxonomy) => (
                    <option key={taxonomy.id} value={taxonomy.id}>
                      {taxonomy.name}
                    </option>
                  ))}
                </Select>
                <FieldError />
              </Field>
            </Section>

            <div className="flex justify-end">
              <Button type="submit">{isEditing ? 'Update Discussion' : 'Create Discussion'}</Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  )
}

DiscussionsForm.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
