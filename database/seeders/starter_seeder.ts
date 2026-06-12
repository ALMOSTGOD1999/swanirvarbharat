import app from '@adonisjs/core/services/app'
import db from '@adonisjs/lucid/services/db'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

import { UserFactory } from '#database/factories/user_factory'
import { Roles } from '#enums/roles'
import Role from '#models/role'
import User from '#models/user'
import { TaxonomyFactory } from '#database/factories/taxonomy_factory'
import { SeriesFactory } from '#database/factories/series_factory'
import { CourseFactory } from '#database/factories/course_factory'
import { CourseModuleFactory } from '#database/factories/course_module_factory'
import { PlaylistFactory } from '#database/factories/playlist_factory'
import { PathFactory } from '#database/factories/path_factory'
import { PostFactory } from '#database/factories/post_factory'
import { DiscussionFactory } from '#database/factories/discussion_factory'
import { CommentFactory } from '#database/factories/comment_factory'
import UtilityService from '#services/utility_service'
import { cuid } from '#utils/id'
import logger from '@adonisjs/core/services/logger'
import AccessLevel from '#models/access_level'
import { States } from '#enums/states'
import { PostTypes } from '#enums/posts'
import { BodyTypes } from '#enums/body'
import type Course from '#models/course'
import { DateTime } from 'luxon'
import { VideoTypes } from '#enums/videos'
import {
  MemberEnrollmentResourceTypes,
  MemberEnrollmentStatuses,
  MemberEnrollmentVideoSources,
} from '#enums/member_enrollments'
import MemberEnrollment from '#models/member_enrollment'

const now = () => DateTime.now().toJSDate()

export default class extends BaseSeeder {
  async run() {
    const trx = await db.transaction()

    try {
      logger.info('Starting starter seeder')
      logger.info('Seeding roles')
      await this.seedRoles(trx)
      logger.info('Roles seeded successfully')

      logger.info('Seeding access levels')
      await this.seedAccessLevels(trx)
      logger.info('Access levels seeded successfully')

      if (!app.inTest && !app.inProduction) {
        logger.info(
          'Seeding dev data (users, taxonomies, blog posts, lessons, courses, series, playlists, paths, discussions)'
        )
        await this.seedUsersAndContent(trx)
        logger.info('Dev data seeded successfully')
      } else {
        logger.info('Skipping dev data seeding (test/production mode)')
      }

      logger.info('Updating admin user credentials')
      await User.query({ client: trx })
        .where('roleId', 'admin')
        .update({
          email: 'sayeed205@gmail.com',
          username: 'sayeed205',
        })
        .first()
      logger.info('Admin user credentials updated')

      await trx.commit()
      logger.info('Starter seeder completed successfully')
    } catch (error) {
      logger.error({ err: error }, 'Seeder failed!!! Reverting back...')
      await trx.rollback()
      throw error
    }
  }

  async seedRoles(trx: TransactionClientContract) {
    await Role.updateOrCreateMany(
      'id',
      [
        { id: Roles.USER, name: 'User', description: 'Authenticated User' },
        { id: Roles.ADMIN, name: 'Admin', description: 'Super User' },
        {
          id: Roles.CONTRIBUTOR_LVL_1,
          name: 'Contributor LVL 1',
          description: 'Can contribute content',
        },
        {
          id: Roles.CONTRIBUTOR_LVL_2,
          name: 'Contributor LVL 2',
          description: 'Can contribute content, series, and taxonomies',
        },
      ],
      { client: trx }
    )
  }

  async seedAccessLevels(trx: TransactionClientContract) {
    await AccessLevel.updateOrCreateMany(
      'name',
      [
        { name: 'Free', color: '#10b981', sortOrder: 0, isDefault: true },
        { name: 'One-Time Purchase', color: '#3b82f6', sortOrder: 1, isDefault: false },
        { name: 'Subscription', color: '#f59e0b', sortOrder: 2, isDefault: false },
        { name: 'Member', color: '#8b5cf6', sortOrder: 3, isDefault: false },
        { name: 'Internal', color: '#6366f1', sortOrder: 4, isDefault: false },
      ],
      { client: trx }
    )
  }

  async seedUsersAndContent(trx: TransactionClientContract) {
    logger.info('Creating users (admin, contributors, free users)')
    const password = 'Abcd@1234'
    const baseUser = UserFactory.client(trx).with('profile').merge({ password })

    const admin = await baseUser.apply('admin').create()
    const contributorLvl1 = await baseUser.apply('contributorLvl1').create()
    const contributorLvl2 = await baseUser.apply('contributorLvl2').create()
    const freeUsers = await baseUser.createMany(50)
    const userIds = [
      admin.id,
      contributorLvl1.id,
      contributorLvl2.id,
      ...freeUsers.map((u) => u.id),
    ]
    logger.info('Users created successfully')

    logger.info('Seeding taxonomies')
    const taxonomyIds = await this.seedTaxonomies(trx, admin)
    logger.info('Taxonomies seeded successfully')

    logger.info('Seeding blog posts')
    await this.seedBlogPosts(trx, admin, taxonomyIds)
    logger.info('Blog posts seeded successfully')

    logger.info('Seeding featured lesson happy path content')
    await this.seedLessonHappyPath(trx, admin, taxonomyIds, freeUsers.slice(0, 4))
    logger.info('Featured lesson content seeded successfully')

    const freeAccessLevel = await AccessLevel.query({ client: trx }).where('name', 'Free').first()
    if (!freeAccessLevel) {
      throw new Error('Free access level not found')
    }

    // Create featured series "Let's Learn AdonisJS" with 5 modules (as course), 5 lessons each
    logger.info('Creating featured series "Let\'s Learn AdonisJS" with 5 modules, 5 lessons each')
    await this.seedFeaturedSeries(trx, admin, taxonomyIds, userIds, freeAccessLevel.id)
    logger.info('Featured series created')

    // Create 5 regular series with posts
    logger.info('Creating 5 regular series for admin')
    await this.seedRegularSeries(trx, admin, 5, taxonomyIds, userIds)
    logger.info('5 regular series created')

    // Create 3 courses with 3 modules, 4 lessons each
    logger.info('Creating 3 courses for admin (3 modules each, 4 lessons per module)')
    await this.seedCourses(trx, admin, 3, 3, 4, taxonomyIds, userIds, freeAccessLevel.id)
    logger.info('3 courses created')

    // Create 2 playlists with 10 posts each
    logger.info('Creating 2 playlists with 10 posts each')
    await this.seedPlaylists(trx, admin, 2, 10, userIds)
    logger.info('2 playlists created')

    // Create 1 path linking 3 courses
    logger.info('Creating 1 path linking 3 courses')
    await this.seedPath(trx, admin, freeAccessLevel.id)
    logger.info('Path created')

    // Create 20 discussions with 4 comments each
    logger.info('Creating 20 discussions with 4 comments each')
    await this.seedDiscussions(trx, admin, userIds, taxonomyIds, 20, 4)
    logger.info('Discussions created')
  }

  async seedTaxonomies(trx: TransactionClientContract, admin: User) {
    const ownerId = admin.id
    const rootTaxonomyNames = ['AdonisJS', 'AWS Amplify', 'Nuxt', 'JavaScript', 'VueJS', 'HTMX']
    const adonisChildrenNames = [
      'Bouncer',
      'Router',
      'HttpContext',
      'Ace CLI',
      'Validator',
      'Lucid',
      'Tips',
      'Edge',
      'Authorization',
    ]
    const taxBase = TaxonomyFactory.client(trx)
    const [adonis, ...others] = await Promise.all(
      rootTaxonomyNames.map((name) => taxBase.merge({ name, ownerId }).create())
    )
    const adonisChildren = await Promise.all(
      adonisChildrenNames.map((name) =>
        taxBase.merge({ name, parentId: adonis.id, rootParentId: adonis.id, ownerId }).create()
      )
    )
    logger.info(
      `Taxonomies seeded: ${1 + rootTaxonomyNames.length + adonisChildrenNames.length} total`
    )

    return [adonis.id, ...others.map((t) => t.id), ...adonisChildren.map((t) => t.id)]
  }

  async seedFeaturedSeries(
    trx: TransactionClientContract,
    admin: User,
    taxonomyIds: string[],
    _userIds: string[],
    accessLevelId: string
  ) {
    const series = await SeriesFactory.client(trx)
      .merge({ ownerId: admin.id, name: "Let's Learn AdonisJS", isFeatured: true })
      .create()

    await db
      .table('series_taxonomies')
      .insert({
        id: cuid(),
        series_id: series.id,
        taxonomy_id: UtilityService.getRandom(taxonomyIds),
        sort_order: 0,
        created_at: now(),
        updated_at: now(),
      })
      .useTransaction(trx)

    // Create 5 modules with 5 lessons each (using Course + CourseModule structure)
    const course = await CourseFactory.client(trx)
      .merge({ ownerId: admin.id, name: "Let's Learn AdonisJS", accessLevelId, isFeatured: true })
      .create()

    await db
      .table('course_taxonomies')
      .insert({
        id: cuid(),
        course_id: course.id,
        taxonomy_id: UtilityService.getRandom(taxonomyIds),
        sort_order: 0,
        created_at: now(),
        updated_at: now(),
      })
      .useTransaction(trx)

    const allPosts: { id: string }[] = []

    for (let moduleIndex = 0; moduleIndex < 5; moduleIndex++) {
      const module = await CourseModuleFactory.client(trx)
        .merge({
          courseId: course.id,
          name: `Module ${moduleIndex + 1}: ${['Getting Started', 'Core Concepts', 'Advanced Topics', 'Best Practices', 'Real World Projects'][moduleIndex]}`,
          sortOrder: moduleIndex,
        })
        .create()

      for (let lessonIndex = 0; lessonIndex < 5; lessonIndex++) {
        const post = await PostFactory.client(trx)
          .apply('video')
          .merge({
            title: `Lesson ${moduleIndex + 1}.${lessonIndex + 1}: ${['Introduction', 'Setup', 'Implementation', 'Testing', 'Deployment'][lessonIndex]}`,
          })
          .create()

        // Link post to module via course_module_posts
        await db
          .table('course_module_posts')
          .insert({
            id: cuid(),
            course_module_id: module.id,
            post_id: post.id,
            sort_order: lessonIndex,
            created_at: now(),
            updated_at: now(),
          })
          .useTransaction(trx)

        await db
          .table('author_posts')
          .insert({
            id: cuid(),
            user_id: admin.id,
            post_id: post.id,
            created_at: now(),
            updated_at: now(),
          })
          .useTransaction(trx)

        await db
          .table('post_taxonomies')
          .insert({
            id: cuid(),
            post_id: post.id,
            taxonomy_id: UtilityService.getRandom(taxonomyIds),
            sort_order: 0,
            created_at: now(),
            updated_at: now(),
          })
          .useTransaction(trx)

        allPosts.push(post)
      }
    }

    // Attach all posts to the series
    const seriesPostInserts = allPosts.map((post, index) => ({
      id: cuid(),
      series_id: series.id,
      post_id: post.id,
      sort_order: index,
      created_at: now(),
      updated_at: now(),
    }))
    await db.table('series_posts').insert(seriesPostInserts).useTransaction(trx)
  }

  async seedBlogPosts(trx: TransactionClientContract, admin: User, taxonomyIds: string[]) {
    const blogPosts = [
      {
        title: 'Building a Blog Section with AdonisJS',
        description: 'A practical walkthrough for shipping a content-first blog experience.',
        body: [
          '<p>Start with a clean content model and keep the public routes focused on published posts.</p>',
          '<p>Use predictable slugs, author relations, and topic taxonomies so the blog stays easy to browse.</p>',
        ].join(''),
      },
      {
        title: 'Writing Better Post Metadata',
        description:
          'Small metadata improvements that make post cards and detail pages feel complete.',
        body: [
          '<p>Descriptions, page titles, and structured publishing dates make blog content easier to surface.</p>',
          '<p>Keep the metadata consistent so lists, detail pages, and search results all tell the same story.</p>',
        ].join(''),
      },
      {
        title: 'Organizing Content Topics for Readers',
        description: 'How to group related articles into browsable topic pages.',
        body: [
          '<p>Topic pages work best when every article is linked to a small set of meaningful taxonomies.</p>',
          '<p>That structure gives readers a clear next step after they finish a post.</p>',
        ].join(''),
      },
      {
        title: 'Designing a Simple Editorial Workflow',
        description: 'A lightweight approach to drafting, reviewing, and publishing blog posts.',
        body: [
          '<p>Keep drafts private until the content is ready, then publish with enough lead time for public listings.</p>',
          '<p>A simple workflow is easier to maintain and still supports a steady publishing cadence.</p>',
        ].join(''),
      },
      {
        title: 'Improving Readability in Long-Form Articles',
        description: 'Structure and pacing tips for articles that need to hold attention.',
        body: [
          '<p>Short sections, clear headings, and concise examples help readers scan quickly.</p>',
          '<p>Read time should reflect the actual body length so article cards feel trustworthy.</p>',
        ].join(''),
      },
      {
        title: 'Publishing Posts That Age Well',
        description: 'Notes on evergreen content and why publish dates still matter.',
        body: [
          '<p>Evergreen posts can stay relevant for months when the advice is focused on fundamentals.</p>',
          '<p>Publishing them far enough in the past keeps them visible in public blog listings.</p>',
        ].join(''),
      },
      {
        title: 'Keeping Related Articles Connected',
        description: 'Why internal linking and topic grouping matter for content navigation.',
        body: [
          '<p>Related posts help readers move from one idea to the next without leaving the product.</p>',
          '<p>Taxonomy links and author attribution make those connections feel intentional.</p>',
        ].join(''),
      },
      {
        title: 'A Practical Checklist for New Blog Launches',
        description: 'The core pieces to verify before a new blog goes live.',
        body: [
          '<p>Check the slug, author, topics, and publish state before the post ships.</p>',
          '<p>Those details are enough to make the blog index and article detail routes work smoothly.</p>',
        ].join(''),
      },
    ]

    const topicIds = taxonomyIds.filter(Boolean)
    if (!topicIds.length) return

    for (const [i, blogPost] of blogPosts.entries()) {
      const publishedAt = DateTime.now().minus({ days: 16 + i * 7 })

      const post = await PostFactory.client(trx)
        .merge({
          title: blogPost.title,
          description: blogPost.description,
          body: blogPost.body,
          bodyType: BodyTypes.HTML,
          postType: PostTypes.BLOG,
          state: States.PUBLIC,
          publishedAt,
          isPersonal: false,
        })
        .create()

      await db
        .table('author_posts')
        .insert({
          id: cuid(),
          user_id: admin.id,
          post_id: post.id,
          created_at: now(),
          updated_at: now(),
        })
        .useTransaction(trx)

      const primaryTopicId = topicIds[i % topicIds.length]
      const secondaryTopicId = topicIds[(i + 5) % topicIds.length]
      const postTaxonomies = [primaryTopicId, secondaryTopicId]
        .filter(
          (taxonomyId, index, all) => Boolean(taxonomyId) && all.indexOf(taxonomyId) === index
        )
        .map((taxonomyId, sortOrder) => ({
          id: cuid(),
          post_id: post.id,
          taxonomy_id: taxonomyId,
          sort_order: sortOrder,
          created_at: now(),
          updated_at: now(),
        }))

      if (postTaxonomies.length > 0) {
        await db.table('post_taxonomies').insert(postTaxonomies).useTransaction(trx)
      }
    }
  }

  async seedLessonHappyPath(
    trx: TransactionClientContract,
    admin: User,
    taxonomyIds: string[],
    enrollmentUsers: User[]
  ) {
    const topicIds = taxonomyIds.filter(Boolean)
    if (!topicIds.length) return

    const lessons = [
      {
        title: 'Build a Typed AdonisJS Controller',
        description:
          'Create a controller that validates input, returns transformer data, and stays type-safe.',
        body: [
          '<p>Start with the route contract, then keep the controller small enough that every branch is easy to test.</p>',
          '<p>Use validators for input and transformers for output so the page receives a predictable shape.</p>',
        ].join(''),
        videoUrl: 'https://www.youtube.com/watch?v=Npn-2qweD5k',
        videoSeconds: 1180,
      },
      {
        title: 'Design an Inertia Filter Toolbar',
        description:
          'Build a compact catalog filter that preserves state and mirrors admin table behavior.',
        body: [
          '<p>Filter controls should keep the route querystring readable and avoid pushing users away from the catalog.</p>',
          '<p>Use router visits with preserveState and preserveScroll for fast, app-like interactions.</p>',
        ].join(''),
        videoUrl: 'https://www.youtube.com/watch?v=q0I3bzYUE1A',
        videoSeconds: 920,
      },
      {
        title: 'Article Lesson: Model Access Rules',
        description:
          'A written walkthrough for deriving lesson access from course membership and access levels.',
        body: [
          '<p>Hybrid migrations work best when they reuse the existing models and add only the fields that unlock real behavior.</p>',
          '<p>For lessons, access can be derived from linked courses until a richer subscription model is introduced.</p>',
        ].join(''),
        videoUrl: null,
        videoSeconds: 0,
      },
    ]

    for (const [i, lesson] of lessons.entries()) {
      const post = await PostFactory.client(trx)
        .merge({
          title: lesson.title,
          description: lesson.description,
          body: lesson.body,
          bodyType: BodyTypes.HTML,
          postType: PostTypes.LESSON,
          state: States.PUBLIC,
          publishedAt: DateTime.now().minus({ days: 24 + i * 3 }),
          isPersonal: false,
          videoType: lesson.videoUrl ? VideoTypes.YOUTUBE : VideoTypes.NONE,
          videoUrl: lesson.videoUrl,
          videoSeconds: lesson.videoSeconds,
        })
        .create()

      await db
        .table('author_posts')
        .insert({
          id: cuid(),
          user_id: admin.id,
          post_id: post.id,
          created_at: now(),
          updated_at: now(),
        })
        .useTransaction(trx)

      const postTaxonomies = [topicIds[i % topicIds.length], topicIds[(i + 3) % topicIds.length]]
        .filter(
          (taxonomyId, index, all) => Boolean(taxonomyId) && all.indexOf(taxonomyId) === index
        )
        .map((taxonomyId, sortOrder) => ({
          id: cuid(),
          post_id: post.id,
          taxonomy_id: taxonomyId,
          sort_order: sortOrder,
          created_at: now(),
          updated_at: now(),
        }))

      if (postTaxonomies.length > 0) {
        await db.table('post_taxonomies').insert(postTaxonomies).useTransaction(trx)
      }
    }

    const memberAccessLevel = await AccessLevel.query({ client: trx })
      .where('name', 'Member')
      .first()
    if (!memberAccessLevel) return

    const gatedCourse = await CourseFactory.client(trx)
      .merge({
        ownerId: admin.id,
        name: 'Member Workshop: Production Lessons',
        accessLevelId: memberAccessLevel.id,
        enrollmentAttemptLimit: 3,
      })
      .create()
    const gatedModule = await CourseModuleFactory.client(trx)
      .merge({ courseId: gatedCourse.id, name: 'Production Patterns', sortOrder: 0 })
      .create()
    const gatedPost = await PostFactory.client(trx)
      .merge({
        title: 'Member Lesson: Production Deployment Checklist',
        description: 'A gated lesson showing the member enrollment access path.',
        body: '<p>Use this checklist before shipping a production lesson workflow.</p><p>Verify access, progress, watchlist state, and SEO metadata.</p>',
        bodyType: BodyTypes.HTML,
        postType: PostTypes.LESSON,
        state: States.PUBLIC,
        publishedAt: DateTime.now().minus({ days: 45 }),
        isPersonal: false,
        videoType: VideoTypes.YOUTUBE,
        videoUrl: 'https://www.youtube.com/watch?v=zvK4-suEKnM',
        videoSeconds: 1440,
      })
      .create()

    const memberSeries = await SeriesFactory.client(trx)
      .merge({
        ownerId: admin.id,
        name: 'Member Series: Advanced Application Patterns',
        accessLevelId: memberAccessLevel.id,
        enrollmentAttemptLimit: 3,
      })
      .create()

    await db
      .table('course_module_posts')
      .insert({
        id: cuid(),
        course_module_id: gatedModule.id,
        post_id: gatedPost.id,
        sort_order: 0,
        created_at: now(),
        updated_at: now(),
      })
      .useTransaction(trx)
    await db
      .table('author_posts')
      .insert({
        id: cuid(),
        user_id: admin.id,
        post_id: gatedPost.id,
        created_at: now(),
        updated_at: now(),
      })
      .useTransaction(trx)
    await db
      .table('post_taxonomies')
      .insert({
        id: cuid(),
        post_id: gatedPost.id,
        taxonomy_id: topicIds[0],
        sort_order: 0,
        created_at: now(),
        updated_at: now(),
      })
      .useTransaction(trx)

    await db
      .table('series_posts')
      .insert({
        id: cuid(),
        series_id: memberSeries.id,
        post_id: gatedPost.id,
        sort_order: 0,
        created_at: now(),
        updated_at: now(),
      })
      .useTransaction(trx)

    const seededStatuses = [
      MemberEnrollmentStatuses.PENDING,
      MemberEnrollmentStatuses.APPROVED,
      MemberEnrollmentStatuses.REJECTED,
      MemberEnrollmentStatuses.REVOKED,
    ] as const

    for (const [index, status] of seededStatuses.entries()) {
      const applicant = enrollmentUsers[index]
      if (!applicant) continue

      await MemberEnrollment.create(
        {
          userId: applicant.id,
          resourceType:
            index % 2 === 0
              ? MemberEnrollmentResourceTypes.COURSE
              : MemberEnrollmentResourceTypes.SERIES,
          resourceId: index % 2 === 0 ? gatedCourse.id : memberSeries.id,
          status,
          attemptNumber: status === MemberEnrollmentStatuses.REJECTED ? 2 : 1,
          reason:
            'I am working through the advanced production curriculum and want access so I can apply these patterns in a real project.',
          contextLinks: JSON.stringify(['https://example.com/member-application-context']),
          videoSource: MemberEnrollmentVideoSources.URL,
          videoUrl: 'https://example.com/member-application-video',
          reviewerId:
            status === MemberEnrollmentStatuses.APPROVED ||
            status === MemberEnrollmentStatuses.REJECTED
              ? admin.id
              : null,
          reviewedAt:
            status === MemberEnrollmentStatuses.APPROVED ||
            status === MemberEnrollmentStatuses.REJECTED
              ? DateTime.now().minus({ days: 1 })
              : null,
          rejectionReason:
            status === MemberEnrollmentStatuses.REJECTED
              ? 'Please include a clearer walkthrough of your current project goals before resubmitting.'
              : null,
          revokedById: status === MemberEnrollmentStatuses.REVOKED ? admin.id : null,
          revokedAt:
            status === MemberEnrollmentStatuses.REVOKED ? DateTime.now().minus({ hours: 6 }) : null,
          revocationReason:
            status === MemberEnrollmentStatuses.REVOKED
              ? 'Access was revoked after the application details no longer matched the current member criteria.'
              : null,
        },
        { client: trx }
      )
    }
  }

  async seedRegularSeries(
    trx: TransactionClientContract,
    admin: User,
    count: number,
    taxonomyIds: string[],
    _userIds: string[]
  ) {
    const seriesNames = [
      'Node.js Essentials',
      'TypeScript Mastery',
      'React Patterns',
      'Vue.js Deep Dive',
      'Svelte Guide',
    ]

    for (let i = 0; i < count; i++) {
      const series = await SeriesFactory.client(trx)
        .merge({ ownerId: admin.id, name: seriesNames[i] })
        .create()

      await db
        .table('series_taxonomies')
        .insert({
          id: cuid(),
          series_id: series.id,
          taxonomy_id: UtilityService.getRandom(taxonomyIds),
          sort_order: 0,
          created_at: now(),
          updated_at: now(),
        })
        .useTransaction(trx)

      // Create 4 modules with 5 lessons each
      const course = await CourseFactory.client(trx)
        .merge({ ownerId: admin.id, name: seriesNames[i] })
        .create()

      const allPosts: { id: string }[] = []

      for (let moduleIndex = 0; moduleIndex < 4; moduleIndex++) {
        const module = await CourseModuleFactory.client(trx)
          .merge({ courseId: course.id, name: `Module ${moduleIndex + 1}`, sortOrder: moduleIndex })
          .create()

        for (let lessonIndex = 0; lessonIndex < 5; lessonIndex++) {
          const post = await PostFactory.client(trx).apply('video').create()

          await db
            .table('course_module_posts')
            .insert({
              id: cuid(),
              course_module_id: module.id,
              post_id: post.id,
              sort_order: lessonIndex,
              created_at: now(),
              updated_at: now(),
            })
            .useTransaction(trx)

          await db
            .table('author_posts')
            .insert({
              id: cuid(),
              user_id: admin.id,
              post_id: post.id,
              created_at: now(),
              updated_at: now(),
            })
            .useTransaction(trx)

          await db
            .table('post_taxonomies')
            .insert({
              id: cuid(),
              post_id: post.id,
              taxonomy_id: UtilityService.getRandom(taxonomyIds),
              sort_order: 0,
              created_at: now(),
              updated_at: now(),
            })
            .useTransaction(trx)

          allPosts.push(post)
        }
      }

      // Attach all posts to the series
      const seriesPostInserts = allPosts.map((post, index) => ({
        id: cuid(),
        series_id: series.id,
        post_id: post.id,
        sort_order: index,
        created_at: now(),
        updated_at: now(),
      }))
      await db.table('series_posts').insert(seriesPostInserts).useTransaction(trx)
    }
  }

  async seedCourses(
    trx: TransactionClientContract,
    admin: User,
    count: number,
    modulesPerCourse: number,
    lessonsPerModule: number,
    taxonomyIds: string[],
    _userIds: string[],
    accessLevelId: string
  ) {
    const courseNames = ['AdonisJS Fundamentals', 'Lucid ORM Deep Dive', 'Building APIs']

    for (let i = 0; i < count; i++) {
      const course = await CourseFactory.client(trx)
        .merge({ ownerId: admin.id, name: courseNames[i] ?? `Course ${i + 1}`, accessLevelId })
        .create()

      await db
        .table('course_taxonomies')
        .insert({
          id: cuid(),
          course_id: course.id,
          taxonomy_id: UtilityService.getRandom(taxonomyIds),
          sort_order: 0,
          created_at: now(),
          updated_at: now(),
        })
        .useTransaction(trx)

      for (let moduleIndex = 0; moduleIndex < modulesPerCourse; moduleIndex++) {
        const module = await CourseModuleFactory.client(trx)
          .merge({ courseId: course.id, name: `Module ${moduleIndex + 1}`, sortOrder: moduleIndex })
          .create()

        for (let lessonIndex = 0; lessonIndex < lessonsPerModule; lessonIndex++) {
          const post = await PostFactory.client(trx).apply('video').create()

          await db
            .table('course_module_posts')
            .insert({
              id: cuid(),
              course_module_id: module.id,
              post_id: post.id,
              sort_order: lessonIndex,
              created_at: now(),
              updated_at: now(),
            })
            .useTransaction(trx)

          await db
            .table('author_posts')
            .insert({
              id: cuid(),
              user_id: admin.id,
              post_id: post.id,
              created_at: now(),
              updated_at: now(),
            })
            .useTransaction(trx)

          await db
            .table('post_taxonomies')
            .insert({
              id: cuid(),
              post_id: post.id,
              taxonomy_id: UtilityService.getRandom(taxonomyIds),
              sort_order: 0,
              created_at: now(),
              updated_at: now(),
            })
            .useTransaction(trx)
        }
      }
    }
  }

  async seedPlaylists(
    trx: TransactionClientContract,
    admin: User,
    count: number,
    postsPerPlaylist: number,
    _userIds: string[]
  ) {
    const playlistNames = ['Web Development Essentials', 'Backend Mastery']

    for (let i = 0; i < count; i++) {
      const playlist = await PlaylistFactory.client(trx)
        .merge({ ownerId: admin.id, name: playlistNames[i] ?? `Playlist ${i + 1}` })
        .create()

      const playlistPostInserts: {
        id: string
        playlist_id: string
        post_id: string
        sort_order: number
        created_at: Date
        updated_at: Date
      }[] = []
      for (let j = 0; j < postsPerPlaylist; j++) {
        const post = await PostFactory.client(trx).apply('video').create()

        await db
          .table('author_posts')
          .insert({
            id: cuid(),
            user_id: admin.id,
            post_id: post.id,
            created_at: now(),
            updated_at: now(),
          })
          .useTransaction(trx)

        playlistPostInserts.push({
          id: cuid(),
          playlist_id: playlist.id,
          post_id: post.id,
          sort_order: j,
          created_at: now(),
          updated_at: now(),
        })
      }

      await db.table('playlist_posts').insert(playlistPostInserts).useTransaction(trx)
    }
  }

  async seedPath(trx: TransactionClientContract, admin: User, accessLevelId: string) {
    const courses: Course[] = []
    const courseNames = ['JavaScript Basics', 'Node.js Fundamentals', 'AdonisJS Mastery']

    for (let i = 0; i < 3; i++) {
      const course = await CourseFactory.client(trx)
        .merge({ ownerId: admin.id, name: courseNames[i], accessLevelId })
        .create()
      courses.push(course)
    }

    const path = await PathFactory.client(trx)
      .merge({ ownerId: admin.id, name: 'Full Stack Developer Path', isFeatured: true })
      .create()

    const pathCourseInserts = courses.map((course, index) => ({
      id: cuid(),
      path_id: path.id,
      course_id: course.id,
      sort_order: index,
      created_at: now(),
      updated_at: now(),
    }))
    await db.table('path_courses').insert(pathCourseInserts).useTransaction(trx)
  }

  async seedDiscussions(
    trx: TransactionClientContract,
    _admin: User,
    userIds: string[],
    _taxonomyIds: string[],
    discussionCount: number,
    commentsPerDiscussion: number
  ) {
    const discussionTitles = [
      'Help with routing',
      'Database question',
      'Best practices',
      'Performance issue',
      'Deployment help',
    ]
    const commentBodies = [
      'Great question!',
      'I had the same issue.',
      'Here is my solution.',
      'Thanks for sharing.',
      'Very helpful!',
    ]

    for (let i = 0; i < discussionCount; i++) {
      const randomUserId = UtilityService.getRandom(userIds)
      const discussion = await DiscussionFactory.client(trx)
        .merge({
          userId: randomUserId,
          title: `Discussion ${i + 1}: ${discussionTitles[i % discussionTitles.length]}`,
        })
        .create()

      for (let j = 0; j < commentsPerDiscussion; j++) {
        await CommentFactory.client(trx)
          .merge({
            userId: UtilityService.getRandom(userIds),
            discussionId: discussion.id,
            body: `This is comment ${j + 1} on the discussion. ${commentBodies[j % commentBodies.length]}`,
          })
          .create()
      }
    }
  }
}
