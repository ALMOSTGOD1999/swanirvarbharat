/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { Exception } from '@adonisjs/core/exceptions'
import app from '@adonisjs/core/services/app'
import router from '@adonisjs/core/services/router'

import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router.get('/', [controllers.Home, 'index']).as('home')

router.where('slug', router.matchers.slug())

if (app.inDev) {
  router.get('/exception/:status', (ctx) => {
    throw new Exception('This is an example exception page.', {
      code: 'E_EXAMPLE',
      status: ctx.params.status || 500,
    })
  })
}

// <------------------------- AUTH ------------------------------->
router
  .group(() => {
    router.get('signup', [controllers.auth.NewAccount, 'create'])
    router.post('signup', [controllers.auth.NewAccount, 'store'])

    router.get('login', [controllers.auth.Session, 'create'])
    router.post('login', [controllers.auth.Session, 'store'])

    router.get('forget-password', [controllers.auth.ForgetPasswords, 'index'])
    router.post('forget-password', [controllers.auth.ForgetPasswords])

    router.get('reset-password/:email', [controllers.auth.ResetPasswords, 'index'])
    router.post('reset-password', [controllers.auth.ResetPasswords])

    router
      .get('verify-email', [controllers.auth.EmailVerification, 'notice'])
      .as('auth.verify.notice')
    router
      .post('verify-email/resend', [controllers.auth.EmailVerification, 'resend'])
      .as('auth.verify.resend')
  })
  .use(middleware.guest())

router
  .get('verify-email/:email', [controllers.auth.EmailVerification, 'verify'])
  .as('auth.verify.handle')

router
  .group(() => {
    router.post('logout', [controllers.auth.Session, 'destroy'])
  })
  .use(middleware.auth())

// <------------------------- ONBOARDING ------------------------------->
router
  .group(() => {
    router.get('/', [controllers.auth.Onboarding, 'show']).as('onboarding.index')
    router
      .post('/personal-info', [controllers.auth.Onboarding, 'savePersonalInfo'])
      .as('onboarding.personalInfo')
    router
      .post('/documents/:field', [controllers.auth.Onboarding, 'uploadDocument'])
      .as('onboarding.documents.upload')
    router
      .post('/documents/remove', [controllers.auth.Onboarding, 'removeDocument'])
      .as('onboarding.documents.remove')
    router
      .post('/intro-video', [controllers.auth.Onboarding, 'uploadIntroVideo'])
      .as('onboarding.introVideo')
    router.post('/kyc', [controllers.auth.Onboarding, 'uploadKyc']).as('onboarding.kyc')
    router.post('/purpose', [controllers.auth.Onboarding, 'savePurpose']).as('onboarding.purpose')
    router.post('/submit', [controllers.auth.Onboarding, 'submit']).as('onboarding.submit')
  })
  .prefix('onboarding')
  .use(middleware.auth())

router
  .get('/application/status', [controllers.auth.Onboarding, 'status'])
  .as('application.status')
  .use(middleware.auth())

// <------------------------- SERIES ------------------------------->
router
  .group(() => {
    router.get('/', [controllers.Series, 'index'])
    router.get('/:slug', [controllers.Series, 'show'])
  })
  .prefix('series')

router.get('/courses/:slug', [controllers.Courses, 'show']).as('courses.show')

router
  .group(() => {
    router
      .get('/my-enrollments', [controllers.MemberEnrollments, 'index'])
      .as('memberEnrollments.index')
    router
      .post('/courses/:slug/member-enrollments', [controllers.MemberEnrollments, 'storeCourse'])
      .as('courses.memberEnrollments.store')
    router
      .patch('/courses/:slug/member-enrollments/:id', [
        controllers.MemberEnrollments,
        'updateCourse',
      ])
      .as('courses.memberEnrollments.update')
    router
      .post('/series/:slug/member-enrollments', [controllers.MemberEnrollments, 'storeSeries'])
      .as('series.memberEnrollments.store')
    router
      .patch('/series/:slug/member-enrollments/:id', [
        controllers.MemberEnrollments,
        'updateSeries',
      ])
      .as('series.memberEnrollments.update')
  })
  .use(middleware.auth())

router.on('/dashboard').renderInertia('dashboard', {}).as('dashboard').use(middleware.auth())

// <------------------------- LESSONS ------------------------------->
router.get('/lessons', [controllers.Lessons, 'index']).as('lessons.index')
router
  .patch('/lessons/set-default-panel', [controllers.LessonPreferences, 'setDefaultPanel'])
  .as('lessons.setDefaultPanel')
router
  .patch('/lessons/:slug/watchlist', [controllers.Watchlists, 'toggleLesson'])
  .as('lessons.watchlist')
  .use(middleware.auth())
router
  .patch('/lessons/:slug/autoplay', [controllers.LessonPreferences, 'toggleAutoplay'])
  .as('lessons.autoplay')
router.get('/lessons/:slug', [controllers.Lessons, 'show']).as('lessons.show')

router
  .group(() => {
    router.get('/users/watchlist', [controllers.Watchlists, 'index']).as('users.watchlist')
    router.post('/progress', [controllers.Progress, 'store']).as('progress.store')
    router.patch('/progress/toggle', [controllers.Progress, 'toggle']).as('progress.toggle')
  })
  .use(middleware.auth())

// <------------------------- SETTINGS ------------------------------->
router
  .group(() => {
    router.get('/', [controllers.Settings, 'index']).as('settings.index')
    router.get('/:section', [controllers.Settings, 'index']).as('settings.show')
    router.put('/profile', [controllers.Settings, 'updateProfile']).as('settings.updateProfile')
    router.put('/username', [controllers.Settings, 'updateUsername']).as('settings.updateUsername')
    router.put('/email', [controllers.Settings, 'updateEmail']).as('settings.updateEmail')
    router.put('/password', [controllers.Settings, 'updatePassword']).as('settings.updatePassword')
    router
      .put('/notifications', [controllers.Settings, 'updateNotifications'])
      .as('settings.updateNotifications')
    router.delete('/account', [controllers.Settings, 'destroy']).as('settings.destroy')
  })
  .prefix('settings')
  .use(middleware.auth())

router.get('/topics', [controllers.Topics, 'index'])
router.get('/topics/:slug', [controllers.Topics, 'show'])
router.get('/blog', [controllers.Blogs, 'index']).as('blogs.index')
router.get('/blog/:slug', [controllers.Blogs, 'show']).as('blogs.show')
router.get('/posts', [controllers.Posts, 'index'])
router.get('/posts/:slug', [controllers.Posts, 'show'])

// <------------------------- COMMENTS ------------------------------->
router
  .group(() => {
    router.resource('comments', controllers.Comments).except(['show', 'index', 'create', 'edit'])
    router.post('comments/:id/vote', [controllers.Comments, 'toggleVote']).as('comments.toggleVote')
  })
  .use(middleware.auth())

// <------------------------- DISCUSSIONS ------------------------------->
router.get('/forum', [controllers.Discussions, 'index']).as('discussions.index')
router.get('/forum/create', [controllers.Discussions, 'create']).as('discussions.create')
router.post('/forum', [controllers.Discussions, 'store']).as('discussions.store')
router.get('/forum/:slug', [controllers.Discussions, 'show']).as('discussions.show')
router.get('/forum/:slug/edit', [controllers.Discussions, 'edit']).as('discussions.edit')
router.put('/forum/:slug', [controllers.Discussions, 'update']).as('discussions.update')
router.delete('/forum/:slug', [controllers.Discussions, 'destroy']).as('discussions.destroy')
router
  .group(() => {
    router
      .post('forum/:id/vote', [controllers.Discussions, 'toggleVote'])
      .as('discussions.toggleVote')
    router
      .post('forum/:slug/solved', [controllers.Discussions, 'toggleSolved'])
      .as('discussions.toggleSolved')
  })
  .use(middleware.auth())

// <------------------------- SEARCH ------------------------------->
router.get('/search', [controllers.Search, 'index']).as('search')

// <------------------------- SYNDICATION ------------------------------->
router.get('/rss', [controllers.Rss, 'index']).as('rss')
router.get('/sitemap.xml', [controllers.Sitemap, 'index']).as('sitemap')

// <------------------------- PUBLIC PROFILE ------------------------------->
router.get('/:handle', [controllers.Profiles, 'show']).as('profiles.show')

// <------------------------- ASSETS ------------------------------->
router.attachments()
