import { type LucideIcon } from 'lucide-react'

import type { Data } from '@generated/data'

export interface ItemNav {
  title: string
  url: string
  icon?: LucideIcon
  external?: boolean
}

interface NavMainSection {
  title: string
  items: ItemNav[]
}

export type NavMainItem = NavMainSection | ItemNav

export function isSection(item: NavMainSection | ItemNav): item is NavMainSection {
  return 'items' in item
}

export interface NavMainProps {
  items: NavMainItem[]
}

export type NavUserOptionsGroup = {
  title: string
  url: string
  icon: LucideIcon
  shortcut?: string
  method?: 'get' | 'post'
}[]

export interface NavUserProps {
  user: Data.User
  options: NavUserOptionsGroup[]
}
