export const PostTypes = {
  LESSON: 'Lesson',
  BLOG: 'Blog Post',
  LINK: 'Link',
  NEWS: 'News',
  LIVESTREAM: 'Livestream',
  SNIPPET: 'Snippet',
}

export type PostType = (typeof PostTypes)[keyof typeof PostTypes]
