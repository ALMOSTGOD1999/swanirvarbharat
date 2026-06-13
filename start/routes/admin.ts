import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'

router
  .group(() => {
    router.get('dashboard', [controllers.admin.Dashboard, 'index'])

    router.resource('posts', controllers.admin.Posts).except(['show'])

    router.resource('taxonomies', controllers.admin.Taxonomies).except(['show'])
    router.get('api/taxonomies', [controllers.admin.Taxonomies, 'apiIndex'])

    router.get('taxonomies/:id/content', [controllers.admin.TaxonomyContents, 'edit'])
    router.put('taxonomies/:id/content', [controllers.admin.TaxonomyContents, 'update'])

    router.get('users', [controllers.admin.Users, 'index'])
    router.get('users/:id', [controllers.admin.Users, 'show'])
    router.patch('users/:id/role', [controllers.admin.Users, 'role'])
    router.delete('users/:id', [controllers.admin.Users, 'destroy'])

    router.get('comments', [controllers.admin.Comments, 'index'])
    router.delete('comments/:id', [controllers.admin.Comments, 'destroy'])

    router.get('discussions', [controllers.admin.Discussions, 'index'])
    router.delete('discussions/:id', [controllers.admin.Discussions, 'destroy'])

    router.resource('roles', controllers.admin.Roles).except(['show'])
    router.get('all-roles', [controllers.admin.Roles, 'apiIndex']).as('roles')

    router.get('assets', [controllers.admin.Assets, 'index'])
    router.get('api/assets', [controllers.admin.Assets, 'apiIndex'])
    router.post('assets', [controllers.admin.Assets, 'store'])
    router.delete('assets/:id', [controllers.admin.Assets, 'destroy'])

    router.resource('courses', controllers.admin.Courses).except(['show'])
    router.post('courses/:id/modules', [controllers.admin.Courses, 'storeModule'])
    router.put('courses/:courseId/modules/:moduleId', [controllers.admin.Courses, 'updateModule'])
    router.delete('courses/:courseId/modules/:moduleId', [
      controllers.admin.Courses,
      'destroyModule',
    ])
    router.put('courses/:courseId/modules/:moduleId/content', [
      controllers.admin.Courses,
      'updateModuleContent',
    ])
    router.put('courses/:id/modules/order', [controllers.admin.Courses, 'reorderModules'])

    router.resource('series', controllers.admin.Series).except(['show'])
    router.post('series/:id/posts', [controllers.admin.Series, 'storePost'])
    router.put('series/:id/posts/order', [controllers.admin.Series, 'reorderPosts'])
    router.delete('series/:seriesId/posts/:postId', [controllers.admin.Series, 'destroyPost'])

    router.resource('playlists', controllers.admin.Playlists).except(['show'])
    router.post('playlists/:id/posts', [controllers.admin.Playlists, 'storePost'])
    router.put('playlists/:id/posts/order', [controllers.admin.Playlists, 'reorderPosts'])
    router.delete('playlists/:playlistId/posts/:postId', [
      controllers.admin.Playlists,
      'destroyPost',
    ])

    router.resource('paths', controllers.admin.Paths).except(['show'])
    router.post('paths/:id/courses', [controllers.admin.Paths, 'storeCourse'])
    router.put('paths/:id/courses/order', [controllers.admin.Paths, 'reorderCourses'])
    router.delete('paths/:pathId/courses/:courseId', [controllers.admin.Paths, 'destroyCourse'])

    router.resource('access-levels', controllers.admin.AccessLevels).except(['show'])
    router.put('access-levels/order', [controllers.admin.AccessLevels, 'reorder'])

    router.get('settings', [controllers.admin.Settings, 'index'])
    router.post('settings', [controllers.admin.Settings, 'update']).as('settings.update')

    router.post('ai/videos/:videoId/chapters', [controllers.admin.Ai, 'videoChapters'])
    router.post('ai/lessons/:lessonId/body-overview', [controllers.admin.Ai, 'bodyOverview'])

    router
      .get('member-enrollments', [controllers.admin.MemberEnrollments, 'index'])
      .as('memberEnrollments.index')
    router
      .get('member-enrollments/:id', [controllers.admin.MemberEnrollments, 'show'])
      .as('memberEnrollments.show')
    router
      .post('member-enrollments/:id/approve', [controllers.admin.MemberEnrollments, 'approve'])
      .as('memberEnrollments.approve')
    router
      .post('member-enrollments/:id/reject', [controllers.admin.MemberEnrollments, 'reject'])
      .as('memberEnrollments.reject')
    router
      .post('member-enrollments/:id/revoke', [controllers.admin.MemberEnrollments, 'revoke'])
      .as('memberEnrollments.revoke')

    router.get('candidates', [controllers.admin.Candidates, 'index']).as('candidates.index')
    router.get('candidates/:id', [controllers.admin.Candidates, 'show']).as('candidates.show')
    router
      .post('candidates/:id/approve', [controllers.admin.Candidates, 'approve'])
      .as('candidates.approve')
    router
      .post('candidates/:id/reject', [controllers.admin.Candidates, 'reject'])
      .as('candidates.reject')
    router
      .post('candidates/:id/remark', [controllers.admin.Candidates, 'remark'])
      .as('candidates.remark')
  })
  .prefix('admin')
  .use(middleware.admin())
  .as('admin')
