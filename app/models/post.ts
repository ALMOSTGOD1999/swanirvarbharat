import { compose } from '@adonisjs/core/helpers'
import { beforeSave, column, computed, hasMany, manyToMany, scope } from '@adonisjs/lucid/orm'
import { slugify } from '@adonisjs/lucid-slugify'
import { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

import { type BodyType, BodyTypes } from '#enums/body'
import { type PostType, PostTypes } from '#enums/posts'
import { type State, States } from '#enums/states'
import { type VideoType, VideoTypes } from '#enums/videos'

import { PostSchema } from '#database/schema'
import PostSnapshot from '#models/post_snapshot'
import PostChapter from '#models/post_chapter'
import Comment from '#models/comment'
import User from '#models/user'
import { withID } from '#utils/with_id_mixin'
import { DateTime } from 'luxon'
import { TimeService } from '#services/time_service'
import ReadService from '#services/read_service'
import Taxonomy from '#models/taxonomy'
import Asset from '#models/asset'
import { AssetTypes } from '#enums/asset'

export default class Post extends compose(PostSchema, withID) {
  @slugify({ strategy: 'dbIncrement', fields: ['title'] })
  declare slug: string

  @column()
  declare state: State

  @column()
  declare postType: PostType

  @column()
  declare bodyType: BodyType

  @column()
  declare videoType: VideoType

  @column()
  declare repositoryUrl: string | null

  @column()
  declare repositoryAccessLevel: number

  @column.dateTime()
  declare ragAddedAt: DateTime | null

  @manyToMany(() => Asset, {
    pivotTable: 'asset_posts',
    pivotColumns: ['sort_order'],
    pivotTimestamps: true,
  })
  declare assets: ManyToMany<typeof Asset>

  @manyToMany(() => Asset, {
    pivotTable: 'asset_posts',
    pivotColumns: ['sort_order'],
    pivotTimestamps: true,
    onQuery: (q) => q.where('type', AssetTypes.THUMBNAIL),
  })
  declare thumbnails: ManyToMany<typeof Asset>

  @manyToMany(() => Asset, {
    pivotTable: 'asset_posts',
    pivotColumns: ['sort_order'],
    pivotTimestamps: true,
    onQuery: (q) => q.where('type', AssetTypes.COVER),
  })
  declare covers: ManyToMany<typeof Asset>

  @hasMany(() => PostSnapshot)
  declare snapshots: HasMany<typeof PostSnapshot>

  @hasMany(() => PostChapter)
  declare chapters: HasMany<typeof PostChapter>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @manyToMany(() => User, {
    pivotTable: 'author_posts',
    pivotColumns: ['author_type_id'],
  })
  declare authors: ManyToMany<typeof User>

  @manyToMany(() => Taxonomy, {
    pivotTable: 'post_taxonomies',
    pivotColumns: ['sort_order'],
    pivotTimestamps: true,
  })
  declare taxonomies: ManyToMany<typeof Taxonomy>

  @computed()
  get publishedAtISO() {
    if (!this.publishedAt) return ''
    return this.publishedAt.toISO()
  }

  @computed()
  get publishedAtDisplay() {
    if (!this.publishedAt) return ''

    if (DateTime.now().year === this.publishedAt.year) {
      return this.publishedAt.toFormat('MMM dd')
    }

    return this.publishedAt.toFormat('MMM dd, yy')
  }

  @computed()
  get videoYouTubeId() {
    if (this.videoType !== VideoTypes.YOUTUBE || !this.videoUrl) return ''

    return this.videoUrl
      .replace('https://www.', 'https://')
      .replace('https://youtube.com/watch?v=', '')
      .replace('https://youtube.com/embed/', '')
      .replace('https://youtu.be/', '')
  }

  @computed()
  get videoDriveId() {
    if (this.videoType !== VideoTypes.DRIVE || !this.videoUrl) return ''

    // Handle https://drive.google.com/file/d/{FILE_ID}/view?...
    const fileMatch = this.videoUrl.match(/\/file\/d\/([^\/?#&]+)/)
    if (fileMatch) return fileMatch[1]

    // Handle https://drive.google.com/open?id={FILE_ID}
    const idMatch = this.videoUrl.match(/[?&]id=([^&]+)/)
    if (idMatch) return idMatch[1]

    return this.videoUrl
  }

  @computed()
  get videoEmbedUrl() {
    if (this.videoYouTubeId) {
      return `https://www.youtube.com/embed/${this.videoYouTubeId}`
    }
    if (this.videoDriveId) {
      return `https://drive.google.com/file/d/${this.videoDriveId}/preview`
    }
    return this.videoUrl || ''
  }

  @computed()
  get streamId() {
    if (!this.livestreamUrl) return ''

    return this.livestreamUrl
      .replace('https://www.', 'https://')
      .replace('https://youtube.com/watch?v=', '')
      .replace('https://youtube.com/embed/', '')
      .replace('https://youtu.be/', '')
  }

  @computed()
  get hasVideo() {
    return this.videoUrl || this.livestreamUrl || this.videoBunnyId
  }

  @computed()
  get watchMinutes() {
    if (!this.videoSeconds) return '0m'
    return TimeService.secondsToTimeString(this.videoSeconds)
  }

  @computed()
  get readMinutesDisplay() {
    if (!this.readTime) return 0
    const minutes = Math.floor(this.readTime / 60000)
    const seconds = ((this.readTime % 60000) / 1000).toFixed(0)
    return `${minutes}:${Number.parseInt(seconds) < 10 ? '0' : ''}${seconds}`
  }

  @beforeSave()
  static async setReadTimeValues(post: Post) {
    if (post.$dirty.bodyBlocks) {
      // post.bodyTypeId = BodyTypes.JSON
      // await EditorBlockParser.parse(post)
    } else if (post.$dirty.body) {
      post.bodyType = BodyTypes.HTML
    }

    const readTime = ReadService.getReadCounts(post.body)
    post.readMinutes = readTime.minutes
    post.readTime = readTime.time
    post.wordCount = readTime.words
  }

  static lessons() {
    return this.query().where('postType', PostTypes.LESSON)
  }

  static blogs() {
    return this.query().where('postType', PostTypes.BLOG)
  }

  static news() {
    return this.query().where('postType', PostTypes.NEWS)
  }

  static livestreams() {
    return this.query().where('postType', PostTypes.LIVESTREAM)
  }

  static links() {
    return this.query().where('postType', PostTypes.LINK)
  }

  static snippets() {
    return this.query().where('postType', PostTypes.SNIPPET)
  }

  // static progression = scope<typeof Post, (query: ModelQueryBuilderContract<typeof Post>) => void>(
  //   (query, user: User | undefined = undefined) => {
  //     query.if(user, (truthy) =>
  //       truthy.preload('progressionHistory', (history) =>
  //         history.where({ userId: user!.id }).orderBy('updated_at', 'desc').first()
  //       )
  //     )
  //   }
  // )

  static publishedOrPending = scope((query) => {
    query.whereIn('state', [States.PUBLIC, States.DRAFT, States.UNLISTED])
  })

  static published = scope((query) => {
    query.where('state', States.PUBLIC).where('publishedAt', '<=', DateTime.now().toSQL()!)
  })

  static publishedPublic = scope<
    typeof Post,
    (query: ModelQueryBuilderContract<typeof Post>) => void
  >((query) => {
    query.where('state', States.PUBLIC).where(
      (and) =>
        and
          // .where('paywallTypeId', PaywallTypes.DELAYED_RELEASE)
          .where('publishedAt', '<=', DateTime.now().minus({ days: 14 }).toSQL()!)
      // .orWhere('paywallTypeId', PaywallTypes.NONE)
    )
  })

  static forLessonDisplay = scope<
    typeof Post,
    (query: ModelQueryBuilderContract<typeof Post>) => void
  >((query) => {
    query.preload('thumbnails').preload('authors').preload('taxonomies')
  })

  static forLessonDisplayShow = scope<
    typeof Post,
    (query: ModelQueryBuilderContract<typeof Post>) => void
  >((query) => {
    query
      .preload('thumbnails')
      .preload('authors')
      .preload('taxonomies')
      .preload('chapters', (chapters) => chapters.orderBy('sort_order'))
  })

  static forBlogDisplay = scope<
    typeof Post,
    (query: ModelQueryBuilderContract<typeof Post>) => void
  >((query) => {
    query.preload('thumbnails').preload('authors').preload('taxonomies')
  })

  static forBlogDisplayShow = scope<
    typeof Post,
    (query: ModelQueryBuilderContract<typeof Post>) => void
  >((query) => {
    query
      .preload('thumbnails')
      .preload('authors')
      .preload('taxonomies')
      .preload('chapters', (chapters) => chapters.orderBy('sort_order'))
  })

  static isPublished(post: { publishedAt?: DateTime | string | null; state: State }) {
    if (!post.publishedAt) return false
    return (
      [States.PUBLIC, States.UNLISTED].includes(post.state) &&
      DateTime.fromISO(post.publishedAt.toString()) <= DateTime.now()
    )
  }
}
