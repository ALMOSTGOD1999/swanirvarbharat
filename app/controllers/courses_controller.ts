import type { HttpContext } from '@adonisjs/core/http'

import Course from '#models/course'
import CourseTransformer from '#transformers/course_transformer'
import PostTransformer from '#transformers/post_transformer'
import ResourceAccessService from '#services/resource_access_service'
import MemberEnrollmentTransformer from '#transformers/member_enrollment_transformer'

export default class CoursesController {
  async show({ inertia, params, auth, serialize }: HttpContext) {
    const course = await Course.query()
      .where('slug', params.slug)
      .preload('owner')
      .preload('asset')
      .preload('accessLevel')
      .preload('taxonomies')
      .preload('modules', (modules) => {
        modules.orderBy('sortOrder').preload('modulePosts', (modulePosts) => {
          modulePosts.orderBy('sortOrder').preload('post')
        })
      })
      .firstOrFail()

    const resource = { type: 'course', model: course } as const
    const [courseData, access] = await Promise.all([
      serialize(CourseTransformer.transform(course)),
      ResourceAccessService.forResource(resource, auth.user),
    ])
    const enrollmentData = access.enrollment?.enrollment
      ? await serialize(MemberEnrollmentTransformer.transform(access.enrollment.enrollment))
      : null
    const enrollmentSummary = access.enrollment
      ? {
          attemptsUsed: access.enrollment.attemptsUsed,
          attemptsRemaining: access.enrollment.attemptsRemaining,
          maxAttempts: access.enrollment.maxAttempts,
          canApply: access.enrollment.canApply,
        }
      : null

    const modules = await Promise.all(
      course.modules.map(async (courseModule) => ({
        id: courseModule.id,
        name: courseModule.name,
        notes: courseModule.notes,
        sortOrder: courseModule.sortOrder,
        lessons: await Promise.all(
          courseModule.modulePosts.map(async (modulePost) => {
            const post = await serialize(PostTransformer.transform(modulePost.post))
            return post.data
          })
        ),
      }))
    )

    return inertia.render('courses/show', {
      course: courseData.data,
      modules,
      access: {
        allowed: access.allowed,
        levelName: access.levelName,
        reason: access.reason,
      },
      enrollment: enrollmentData?.data ?? null,
      enrollmentSummary,
    })
  }
}
