import { type Data } from '@generated/data'
import { type PropsWithChildren } from 'react'
import { type JSONDataTypes } from '@adonisjs/core/types/transformers'

export type InertiaProps<T extends JSONDataTypes = {}> = PropsWithChildren<Data.SharedProps & T>

/** Shared type for filter dropdown options (owners, authors, roles, etc.) */
export type FilterOption = { id: string; name: string }
