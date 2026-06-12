import * as React from 'react'
import { Data } from '@generated/data'
import { usePage } from '@inertiajs/react'
import { LayoutDashboard, UsersIcon, SettingsIcon, MessageSquare } from 'lucide-react'
import { Form, Link } from '@adonisjs/inertia/react'
import { Logo } from '~/components/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '~/components/ui/sidebar'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '~/components/ui/menu'
import { urlFor } from '~/client'

const navItems = [
  {
    title: 'Dashboard',
    href: urlFor('dashboard'),
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: 'Series',
    href: urlFor('series.index'),
    icon: UsersIcon,
    isActive: true,
  },
  {
    title: 'Forum',
    href: urlFor('discussions.index'),
    icon: MessageSquare,
    isActive: false,
  },
  {
    title: 'Settings',
    href: urlFor('settings.index'),
    icon: SettingsIcon,
    isActive: false,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = usePage<Data.SharedProps>().props

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader className="px-4 py-5 h-15 leading-7">
        <Logo width={100} height={20} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<Link href={item.href} />} isActive={item.isActive}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <Menu>
          <MenuTrigger
            render={
              <button className="inline-flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer" />
            }
          >
            {user && (
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium"></span>
            )}
          </MenuTrigger>
          <MenuPopup>
            <MenuItem>
              <Form route="session.destroy">
                <button className="" type="submit">
                  Logout
                </button>
              </Form>
            </MenuItem>
          </MenuPopup>
        </Menu>
      </SidebarFooter>
    </Sidebar>
  )
}
