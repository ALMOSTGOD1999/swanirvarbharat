import * as React from 'react'
import { Data } from '@generated/data'
import { usePage } from '@inertiajs/react'
import {
  FileTextIcon,
  ImageIcon,
  LayoutDashboard,
  SettingsIcon,
  ShieldIcon,
  TagsIcon,
  UsersIcon,
  MessageSquareIcon,
  MessageCircleMoreIcon,
  BookOpenIcon,
  KeyIcon,
  ListIcon,
  MusicIcon,
  MapIcon,
} from 'lucide-react'
import { Form } from '@adonisjs/inertia/react'
import { Logo } from '~/components/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '~/components/ui/sidebar'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '~/components/ui/menu'
import { Button } from '~/components/ui/button'
import { urlFor } from '~/client'
import { NavSidebarMain } from '~/components/nav_sidebar_main'
import type { ItemNav } from '~/types/navigation'
import { useAbility, type Subjects } from '~/context/abilities_context'

type AdminNavSection = {
  title: string
  items: (ItemNav & { subject?: Subjects })[]
}

const navItems: AdminNavSection[] = [
  {
    title: 'General',
    items: [
      {
        title: 'Dashboard',
        url: urlFor('admin.dashboard.index'),
        icon: LayoutDashboard,
      },
      {
        title: 'Posts',
        url: urlFor('admin.posts.index'),
        icon: FileTextIcon,
        subject: 'post',
      },
      {
        title: 'Courses',
        url: urlFor('admin.courses.index'),
        icon: BookOpenIcon,
        subject: 'course',
      },
      {
        title: 'Series',
        url: urlFor('admin.series.index'),
        icon: ListIcon,
        subject: 'series',
      },
      {
        title: 'Playlists',
        url: urlFor('admin.playlists.index'),
        icon: MusicIcon,
        subject: 'playlist',
      },
      {
        title: 'Paths',
        url: urlFor('admin.paths.index'),
        icon: MapIcon,
        subject: 'path',
      },
      {
        title: 'Access Levels',
        url: urlFor('admin.access_levels.index'),
        icon: KeyIcon,
        subject: 'accessLevel',
      },
      {
        title: 'Taxonomies',
        url: urlFor('admin.taxonomies.index'),
        icon: TagsIcon,
        subject: 'taxonomy',
      },
      {
        title: 'Users',
        url: urlFor('admin.users.index'),
        icon: UsersIcon,
        subject: 'user',
      },
      {
        title: 'Roles',
        url: urlFor('admin.roles.index'),
        icon: ShieldIcon,
        subject: 'role',
      },
      {
        title: 'Assets',
        url: urlFor('admin.assets.index'),
        icon: ImageIcon,
        subject: 'asset',
      },
      {
        title: 'Comments',
        url: urlFor('admin.comments.index'),
        icon: MessageSquareIcon,
        subject: 'comment',
      },
      {
        title: 'Discussions',
        url: urlFor('admin.discussions.index'),
        icon: MessageCircleMoreIcon,
        subject: 'discussion',
      },
      {
        title: 'Settings',
        url: urlFor('admin.settings.index'),
        icon: SettingsIcon,
      },
    ],
  },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = usePage<Data.SharedProps>().props
  const ability = useAbility()

  const filteredNavItems = navItems.map((section) => ({
    ...section,
    items: section.items.filter((item) => {
      if (!item.subject) return true
      return ability.can('read', item.subject)
    }),
  }))

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="px-4 py-5 h-15 leading-7">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Logo width={100} height={20} />} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavSidebarMain items={filteredNavItems} />
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <Menu>
          <MenuTrigger render={<Button variant="ghost" className="w-full justify-start" />}>
            {user && (
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium"></span>
            )}
          </MenuTrigger>
          <MenuPopup>
            <MenuItem>
              <Form route="session.destroy">
                <Button type="submit" variant="ghost" className="w-full justify-start">
                  Logout
                </Button>
              </Form>
            </MenuItem>
          </MenuPopup>
        </Menu>
      </SidebarFooter>
    </Sidebar>
  )
}
