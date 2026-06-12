import { AccessLevels } from '#enums/access_levels'
import Course from '#models/course'
import type Post from '#models/post'
import Series from '#models/series'
import type User from '#models/user'
import MemberEnrollmentService, {
  type EnrollmentResource,
} from '#services/member_enrollment_service'
import ResourceAccessService, { type ResourceAccessDto } from '#services/resource_access_service'

function deniedPriority(reason: ResourceAccessDto['reason']) {
  const priorities: Record<ResourceAccessDto['reason'], number> = {
    'pending': 1,
    'rejected': 2,
    'revoked': 3,
    'member-approval-required': 4,
    'auth-required': 5,
    'admin-only': 6,
    'public': 7,
    'approved': 8,
    'admin': 9,
    'owner': 10,
  }

  return priorities[reason]
}

export default class LessonAccessService {
  static async check(post: Post, user?: User | null): Promise<ResourceAccessDto> {
    const courseResources = await Course.query()
      .whereHas('modules', (modules) => {
        modules.whereHas('modulePosts', (modulePosts) => {
          modulePosts.where('postId', post.id)
        })
      })
      .preload('owner')
      .preload('accessLevel')

    const seriesResources = await Series.query()
      .whereHas('posts', (posts) => {
        posts.where('posts.id', post.id)
      })
      .preload('owner')
      .preload('accessLevel')

    const resources: EnrollmentResource[] = [
      ...courseResources.map((course) => ({ type: 'course', model: course }) as const),
      ...seriesResources.map((series) => ({ type: 'series', model: series }) as const),
    ]

    if (resources.length === 0) {
      return { allowed: true, levelName: AccessLevels.FREE, reason: 'public' }
    }

    const results = await Promise.all(
      resources.map((resource) => ResourceAccessService.forResource(resource, user))
    )
    const allowed = results.find((result) => result.allowed)
    if (allowed) return allowed

    const denied = results.sort(
      (left, right) => deniedPriority(left.reason) - deniedPriority(right.reason)
    )[0]
    return (
      denied ?? {
        allowed: false,
        levelName: AccessLevels.MEMBER,
        reason: 'member-approval-required',
      }
    )
  }

  static async resourcesForPost(post: Post) {
    const courses = await Course.query()
      .whereHas('modules', (modules) => {
        modules.whereHas('modulePosts', (modulePosts) => {
          modulePosts.where('postId', post.id)
        })
      })
      .preload('owner')
      .preload('accessLevel')

    const series = await Series.query()
      .whereHas('posts', (posts) => {
        posts.where('posts.id', post.id)
      })
      .preload('owner')
      .preload('accessLevel')

    return {
      courses: courses.map((course) =>
        MemberEnrollmentService.resourceSummary({ type: 'course', model: course })
      ),
      series: series.map((item) =>
        MemberEnrollmentService.resourceSummary({ type: 'series', model: item })
      ),
    }
  }
}
