import type { InertiaProps } from '~/types'
import React from 'react'
import DefaultLayout from '~/layouts/default'
import { Head } from '@inertiajs/react'
import { Data } from '@generated/data'
import { MapPinIcon, BuildingIcon, GlobeIcon, CalendarIcon } from 'lucide-react'
import {
  GithubIcon,
  TwitterIcon,
  YoutubeIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
} from '~/components/assets'

type PageProps = InertiaProps<{
  profileUser: Data.User & { profile?: Data.Profile }
}>

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string | null | undefined
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      title={label}
    >
      <Icon className="size-4" />
      <span className="sr-only">{label}</span>
    </a>
  )
}

export default function Profile({ profileUser }: PageProps) {
  const profile = profileUser?.profile

  return (
    <>
      <Head title={`${profileUser?.username ?? 'User'} — Profile`} />
      <div className="container mx-auto max-w-3xl px-5 py-12">
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Avatar */}
          <span className="flex size-24 items-center justify-center rounded-full bg-primary text-primary-foreground text-3xl font-medium">
            {profileUser?.username?.charAt(0).toUpperCase()}
          </span>

          {/* Name & Handle */}
          <div className="space-y-1">
            {profile?.name && <h1 className="text-2xl font-bold">{profile.name}</h1>}
            <p className="text-muted-foreground">@{profileUser?.username}</p>
          </div>

          {/* Bio */}
          {profile?.biography && (
            <p className="max-w-lg text-muted-foreground">{profile.biography}</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            {profile?.location && (
              <span className="inline-flex items-center gap-1">
                <MapPinIcon className="size-3.5" />
                {profile.location}
              </span>
            )}
            {profile?.company && (
              <span className="inline-flex items-center gap-1">
                <BuildingIcon className="size-3.5" />
                {profile.company}
              </span>
            )}
            {profile?.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <GlobeIcon className="size-3.5" />
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {profileUser?.createdAt && (
              <span className="inline-flex items-center gap-1">
                <CalendarIcon className="size-3.5" />
                Joined{' '}
                {new Date(profileUser.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <SocialLink href={profile?.githubUrl} icon={GithubIcon} label="GitHub" />
            <SocialLink href={profile?.twitterUrl} icon={TwitterIcon} label="Twitter" />
            <SocialLink href={profile?.youtubeUrl} icon={YoutubeIcon} label="YouTube" />
            <SocialLink href={profile?.linkedinUrl} icon={LinkedinIcon} label="LinkedIn" />
            <SocialLink href={profile?.facebookUrl} icon={FacebookIcon} label="Facebook" />
            <SocialLink href={profile?.instagramUrl} icon={InstagramIcon} label="Instagram" />
          </div>
        </div>
      </div>
    </>
  )
}

Profile.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
