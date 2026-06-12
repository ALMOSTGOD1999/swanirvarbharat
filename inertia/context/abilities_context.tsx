import {
  AbilityBuilder,
  createMongoAbility,
  type MongoAbility,
  type MongoQuery,
} from '@casl/ability'
import { createContextualCan } from '@casl/react'
import { usePage } from '@inertiajs/react'
import type React from 'react'
import { createContext, useContext, useMemo } from 'react'

export type Subjects =
  | 'post'
  | 'collection'
  | 'taxonomy'
  | 'user'
  | 'role'
  | 'comment'
  | 'discussion'
  | 'asset'
  | 'course'
  | 'accessLevel'
  | 'series'
  | 'playlist'
  | 'path'

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'

export type Rule = {
  action: Actions
  subject: Subjects
  fields?: string[]
  conditions?: MongoQuery<Record<string, any>>
}

interface AbilityProviderProps {
  children: React.ReactNode
}

const emptyAbility = new AbilityBuilder(createMongoAbility).build()
const AbilityContext = createContext<MongoAbility>(emptyAbility)

export const Can = createContextualCan(AbilityContext.Consumer)

export function AbilityProvider({ children }: AbilityProviderProps) {
  const { abilities } = usePage<{ abilities: Rule[] }>().props
  const ability = useMemo(() => {
    if (!abilities?.length) {
      return emptyAbility
    }

    const { can, build } = new AbilityBuilder(createMongoAbility)
    for (const { action, subject, fields, conditions } of abilities) {
      if (fields?.length && conditions) can(action, subject, fields, conditions)
      else if (fields?.length) can(action, subject, fields)
      else if (conditions) can(action, subject, conditions)
      else can(action, subject)
    }
    return build()
  }, [abilities])

  return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
}

export const useAbility = () => {
  const context = useContext(AbilityContext)
  if (!context) {
    throw new Error('useAbility must be used within a AbilityProvider')
  }
  return context
}
