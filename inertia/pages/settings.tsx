import type { InertiaProps } from '~/types'
import React, { useState } from 'react'
import DashboardLayout from '~/layouts/dashboard'
import { Head } from '@inertiajs/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '~/components/ui/breadcrumb'
import { Main } from '~/components/main'
import { Form } from '~/components/ui/form'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Switch } from '~/components/ui/switch'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import { Data } from '@generated/data'
import { UserIcon, KeyIcon, BellIcon, TrashIcon } from 'lucide-react'

type PageProps = InertiaProps<{
  user: Data.User & { profile?: Data.Profile }
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

const sections = [
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'account', label: 'Account', icon: KeyIcon },
  { id: 'notifications', label: 'Notifications', icon: BellIcon },
] as const

type SectionId = (typeof sections)[number]['id']

export default function Settings({ user }: PageProps) {
  const [activeSection, setActiveSection] = useState<SectionId>('profile')
  const profile = user?.profile

  return (
    <>
      <Head title="Settings" />
      <header className="flex h-15 shrink-0 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <Main>
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar tabs */}
          <nav className="flex lg:w-48 shrink-0 flex-row lg:flex-col gap-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <section.icon className="size-4" />
                {section.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeSection === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Profile</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your public profile information.
                  </p>
                </div>

                <Separator />

                <Form route="settings.updateProfile">
                  <Section title="Avatar" description="Your profile picture.">
                    <div className="flex items-center gap-4">
                      <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-medium">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                      <div className="text-sm text-muted-foreground">Avatar upload coming soon</div>
                    </div>
                  </Section>

                  <Separator />

                  <Section title="Basic Info" description="Your basic profile information.">
                    <Field name="name">
                      <FieldLabel>Display Name</FieldLabel>
                      <Input
                        defaultValue={profile?.name ?? ''}
                        placeholder="Your display name"
                        aria-label="Display Name"
                      />
                      <FieldError />
                    </Field>

                    <Field name="biography">
                      <FieldLabel>Bio</FieldLabel>
                      <Textarea
                        defaultValue={profile?.biography ?? ''}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                      <FieldError />
                    </Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field name="location">
                        <FieldLabel>Location</FieldLabel>
                        <Input
                          defaultValue={profile?.location ?? ''}
                          placeholder="City, Country"
                          aria-label="Location"
                        />
                        <FieldError />
                      </Field>

                      <Field name="company">
                        <FieldLabel>Company</FieldLabel>
                        <Input
                          defaultValue={profile?.company ?? ''}
                          placeholder="Company name"
                          aria-label="Company"
                        />
                        <FieldError />
                      </Field>
                    </div>

                    <Field name="website">
                      <FieldLabel>Website</FieldLabel>
                      <Input
                        defaultValue={profile?.website ?? ''}
                        placeholder="https://example.com"
                        aria-label="Website"
                      />
                      <FieldError />
                    </Field>
                  </Section>

                  <Separator />

                  <Section title="Social Links" description="Your social media profiles.">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field name="twitterUrl">
                        <FieldLabel>Twitter / X</FieldLabel>
                        <Input
                          defaultValue={profile?.twitterUrl ?? ''}
                          placeholder="https://twitter.com/username"
                          aria-label="Twitter / X"
                        />
                        <FieldError />
                      </Field>

                      <Field name="githubUrl">
                        <FieldLabel>GitHub</FieldLabel>
                        <Input
                          defaultValue={profile?.githubUrl ?? ''}
                          placeholder="https://github.com/username"
                          aria-label="GitHub"
                        />
                        <FieldError />
                      </Field>

                      <Field name="youtubeUrl">
                        <FieldLabel>YouTube</FieldLabel>
                        <Input
                          defaultValue={profile?.youtubeUrl ?? ''}
                          placeholder="https://youtube.com/@username"
                          aria-label="YouTube"
                        />
                        <FieldError />
                      </Field>

                      <Field name="linkedinUrl">
                        <FieldLabel>LinkedIn</FieldLabel>
                        <Input
                          defaultValue={profile?.linkedinUrl ?? ''}
                          placeholder="https://linkedin.com/in/username"
                          aria-label="LinkedIn"
                        />
                        <FieldError />
                      </Field>

                      <Field name="facebookUrl">
                        <FieldLabel>Facebook</FieldLabel>
                        <Input
                          defaultValue={profile?.facebookUrl ?? ''}
                          placeholder="https://facebook.com/username"
                          aria-label="Facebook"
                        />
                        <FieldError />
                      </Field>

                      <Field name="instagramUrl">
                        <FieldLabel>Instagram</FieldLabel>
                        <Input
                          defaultValue={profile?.instagramUrl ?? ''}
                          placeholder="https://instagram.com/username"
                          aria-label="Instagram"
                        />
                        <FieldError />
                      </Field>

                      <Field name="blueskyUrl">
                        <FieldLabel>Bluesky</FieldLabel>
                        <Input
                          defaultValue={profile?.blueskyUrl ?? ''}
                          placeholder="https://bsky.app/profile/username"
                          aria-label="Bluesky"
                        />
                        <FieldError />
                      </Field>

                      <Field name="threadsUrl">
                        <FieldLabel>Threads</FieldLabel>
                        <Input
                          defaultValue={profile?.threadsUrl ?? ''}
                          placeholder="https://threads.net/@username"
                          aria-label="Threads"
                        />
                        <FieldError />
                      </Field>
                    </div>
                  </Section>

                  <div className="flex justify-end">
                    <Button type="submit">Save Profile</Button>
                  </div>
                </Form>
              </div>
            )}

            {activeSection === 'account' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Account</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your account settings and security.
                  </p>
                </div>

                <Separator />

                <Form route="settings.updateUsername">
                  <Section title="Username" description="Your unique username.">
                    <Field name="username">
                      <FieldLabel>Username</FieldLabel>
                      <Input defaultValue={user?.username ?? ''} aria-label="Username" />
                      <FieldError />
                    </Field>
                    <div className="flex justify-end">
                      <Button type="submit">Update Username</Button>
                    </div>
                  </Section>
                </Form>

                <Separator />

                <Form route="settings.updateEmail">
                  <Section title="Email" description="Your email address.">
                    <Field name="email">
                      <FieldLabel>Email</FieldLabel>
                      <Input defaultValue={user?.email ?? ''} type="email" aria-label="Email" />
                      <FieldError />
                    </Field>
                    <Field name="password">
                      <FieldLabel>Confirm Password</FieldLabel>
                      <Input
                        type="password"
                        placeholder="Enter your password to confirm"
                        aria-label="Confirm Password"
                      />
                      <FieldError />
                    </Field>
                    <div className="flex justify-end">
                      <Button type="submit">Update Email</Button>
                    </div>
                  </Section>
                </Form>

                <Separator />

                <Form route="settings.updatePassword">
                  <Section title="Password" description="Change your password.">
                    <Field name="currentPassword">
                      <FieldLabel>Current Password</FieldLabel>
                      <Input type="password" aria-label="Current Password" />
                      <FieldError />
                    </Field>
                    <Field name="password">
                      <FieldLabel>New Password</FieldLabel>
                      <Input type="password" aria-label="New Password" />
                      <FieldError />
                    </Field>
                    <Field name="passwordConfirmation">
                      <FieldLabel>Confirm New Password</FieldLabel>
                      <Input type="password" aria-label="Confirm New Password" />
                      <FieldError />
                    </Field>
                    <div className="flex justify-end">
                      <Button type="submit">Update Password</Button>
                    </div>
                  </Section>
                </Form>

                <Separator />

                <Form route="settings.destroy">
                  <Section
                    title="Delete Account"
                    description="Permanently delete your account and all associated data."
                  >
                    <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                      <div className="flex items-start gap-3">
                        <TrashIcon className="mt-0.5 size-4 text-destructive" />
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-destructive">
                            This action cannot be undone
                          </p>
                          <p className="text-sm text-muted-foreground">
                            All your data, including posts, comments, and profile information will
                            be permanently deleted.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Field name="password">
                      <FieldLabel>Confirm Password</FieldLabel>
                      <Input
                        type="password"
                        placeholder="Enter your password to confirm deletion"
                        aria-label="Confirm Password for Deletion"
                      />
                      <FieldError />
                    </Field>
                    <div className="flex justify-end">
                      <Button type="submit" variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </Section>
                </Form>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <p className="text-sm text-muted-foreground">
                    Manage your email notification preferences.
                  </p>
                </div>

                <Separator />

                <Form route="settings.updateNotifications">
                  <Section
                    title="Email Notifications"
                    description="Choose which emails you'd like to receive."
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Comments</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email when someone comments on your posts
                          </p>
                        </div>
                        <Switch
                          name="emailOnComment"
                          defaultChecked={profile?.emailOnComment ?? true}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Comment Replies</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email when someone replies to your comments
                          </p>
                        </div>
                        <Switch
                          name="emailOnCommentReply"
                          defaultChecked={profile?.emailOnCommentReply ?? true}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Achievements</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email when you earn a new achievement
                          </p>
                        </div>
                        <Switch
                          name="emailOnAchievement"
                          defaultChecked={profile?.emailOnAchievement ?? true}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">New Device Login</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email when a new device logs into your account
                          </p>
                        </div>
                        <Switch
                          name="emailOnNewDeviceLogin"
                          defaultChecked={profile?.emailOnNewDeviceLogin ?? true}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Watchlist Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email when content in your watchlist is updated
                          </p>
                        </div>
                        <Switch
                          name="emailOnWatchlist"
                          defaultChecked={profile?.emailOnWatchlist ?? true}
                        />
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Mentions</p>
                          <p className="text-sm text-muted-foreground">
                            Receive email when someone mentions you
                          </p>
                        </div>
                        <Switch
                          name="emailOnMention"
                          defaultChecked={profile?.emailOnMention ?? true}
                        />
                      </div>
                    </div>
                  </Section>

                  <div className="flex justify-end">
                    <Button type="submit">Save Preferences</Button>
                  </div>
                </Form>
              </div>
            )}
          </div>
        </div>
      </Main>
    </>
  )
}

Settings.layout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>
