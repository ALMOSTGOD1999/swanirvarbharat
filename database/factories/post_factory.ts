import stringHelpers from '@adonisjs/core/helpers/string'
import factory from '@adonisjs/lucid/factories'
import { DateTime } from 'luxon'

import { States } from '#enums/states'
import { PostTypes } from '#enums/posts'
import { VideoTypes } from '#enums/videos'
import Post from '#models/post'
import { UserFactory } from '#database/factories/user_factory'
import { AssetFactory } from '#database/factories/asset_factory'
import { CommentFactory } from '#database/factories/comment_factory'

const youtubeUrls = [
  'https://www.youtube.com/watch?v=Npn-2qweD5k',
  'https://www.youtube.com/watch?v=q0I3bzYUE1A',
  'https://www.youtube.com/watch?v=zvK4-suEKnM',
  'https://www.youtube.com/watch?v=0AGHmWdnsVM',
  'https://www.youtube.com/watch?v=NdLzhFINrW4',
  'https://www.youtube.com/watch?v=KfkBAYgwAxA',
  'https://www.youtube.com/watch?v=7HyCMmjO9zQ',
  'https://www.youtube.com/watch?v=BPjvak_kB3U',
  'https://www.youtube.com/watch?v=OieU-z4orBk',
]

export const PostFactory = factory
  .define(Post, ({ faker }) => ({
    title: stringHelpers.titleCase(faker.lorem.words({ min: 3, max: 9 })),
    description: faker.lorem.sentences(2),
    body: faker.lorem.paragraphs(5),
    postType: PostTypes.LESSON,
    state: States.PUBLIC,
    publishedAt: DateTime.fromJSDate(faker.date.past()),
    videoSeconds: 0,
    readMinutes: 0,
    readTime: 0,
    wordCount: 0,
  }))
  .state('futureDated', (post, { faker }) => {
    post.publishedAt = DateTime.fromJSDate(faker.date.future())
  })
  .state('draft', (post) => (post.state = States.DRAFT))
  .state('unlisted', (post) => (post.state = States.UNLISTED))
  .state('private', (post) => (post.state = States.PRIVATE))
  .state('lesson', (post) => (post.postType = PostTypes.LESSON))
  .state('blog', (post) => (post.postType = PostTypes.BLOG))
  .state('news', (post) => (post.postType = PostTypes.NEWS))
  .state('snippet', (post) => (post.postType = PostTypes.SNIPPET))
  .state('video', (post, { faker }) => {
    post.videoType = VideoTypes.YOUTUBE
    post.videoUrl = faker.helpers.arrayElement(youtubeUrls)
    post.videoSeconds = faker.number.int({ min: 90, max: 3600 })
  })
  .relation('authors', () => UserFactory)
  .relation('assets', () => AssetFactory)
  .relation('comments', () => CommentFactory)
  .build()
