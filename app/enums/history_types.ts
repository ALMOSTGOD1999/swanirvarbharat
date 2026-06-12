export const HistoryTypes = {
  VIEW: 1,
  PROGRESSION: 2,
} as const

export type HistoryType = (typeof HistoryTypes)[keyof typeof HistoryTypes]
