import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Map a member-enrollment resource type (backend identifier) to a
 * user-facing label. The `series` resource is presented to users as
 * "Course", and the modular `course` resource as "Course Module" to
 * disambiguate the two in the UI.
 */
export function resourceTypeLabel(type: string): string {
  if (type === 'series') return 'Course'
  if (type === 'course') return 'Course Module'
  return type
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
