export const Difficulties = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
}

export type Difficulty = (typeof Difficulties)[keyof typeof Difficulties]
