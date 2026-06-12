import { isSection, ItemNav, NavMainItem } from '~/types/navigation'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '~/components/ui/sidebar'
import { Link } from '@adonisjs/inertia/react'
import { usePage } from '@inertiajs/react'
import { ArrowUpRightIcon } from 'lucide-react'

export function NavSidebarMain({ items }: { items: NavMainItem[] }) {
  const url = usePage().url

  return (
    <>
      {items.map((item) => {
        if (isSection(item)) {
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((subItem) => {
                    const isActive = checkIsActive(url, subItem)
                    return (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          isActive={isActive}
                          tooltip={subItem.title}
                          render={
                            subItem.url ? (
                              subItem.external ? (
                                <a href={subItem.url} target="_blank" rel="noopener noreferrer">
                                  {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0" />}
                                  <span>{subItem.title}</span>
                                  <ArrowUpRightIcon className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />
                                </a>
                              ) : (
                                <Link href={subItem.url}>
                                  {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0" />}
                                  <span>{subItem.title}</span>
                                </Link>
                              )
                            ) : (
                              <span>
                                {subItem.icon && <subItem.icon className="h-4 w-4 shrink-0" />}
                                <span>{subItem.title}</span>
                              </span>
                            )
                          }
                        />
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        } else {
          const isActive = checkIsActive(url, item)
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={
                        item.url ? (
                          item.external ? (
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                              <span>{item.title}</span>
                            </a>
                          ) : (
                            <Link href={item.url}>
                              {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                              <span>{item.title}</span>
                            </Link>
                          )
                        ) : (
                          <span>
                            {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                            <span>{item.title}</span>
                          </span>
                        )
                      }
                    />
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        }
      })}
    </>
  )
}

function checkIsActive(href: string, item: ItemNav, mainNav = false) {
  return (
    href === item.url || // /endpint?search=param
    href.split('?')[0] === item.url || // endpoint
    (mainNav && href.split('/')[1] !== '' && href.split('/')[1] === item?.url?.split('/')[1])
  )
}
