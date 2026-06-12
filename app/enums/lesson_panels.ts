export const LessonPanels = {
  OVERVIEW: 'overview',
  TRANSCRIPT: 'transcript',
  NOTES: 'notes',
} as const

export type LessonPanel = (typeof LessonPanels)[keyof typeof LessonPanels]

export const lessonPanelValues = Object.values(LessonPanels)
