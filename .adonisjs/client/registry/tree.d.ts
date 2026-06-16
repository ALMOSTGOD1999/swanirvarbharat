/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  drive: {
    fs: {
      serve: typeof routes['drive.fs.serve']
    }
  }
  admin: {
    dashboard: {
      index: typeof routes['admin.dashboard.index']
    }
    posts: {
      index: typeof routes['admin.posts.index']
      create: typeof routes['admin.posts.create']
      store: typeof routes['admin.posts.store']
      edit: typeof routes['admin.posts.edit']
      update: typeof routes['admin.posts.update']
      destroy: typeof routes['admin.posts.destroy']
    }
    taxonomies: {
      index: typeof routes['admin.taxonomies.index']
      create: typeof routes['admin.taxonomies.create']
      store: typeof routes['admin.taxonomies.store']
      edit: typeof routes['admin.taxonomies.edit']
      update: typeof routes['admin.taxonomies.update']
      destroy: typeof routes['admin.taxonomies.destroy']
      apiIndex: typeof routes['admin.taxonomies.api_index']
    }
    taxonomyContents: {
      edit: typeof routes['admin.taxonomy_contents.edit']
      update: typeof routes['admin.taxonomy_contents.update']
    }
    users: {
      index: typeof routes['admin.users.index']
      show: typeof routes['admin.users.show']
      role: typeof routes['admin.users.role']
      destroy: typeof routes['admin.users.destroy']
    }
    comments: {
      index: typeof routes['admin.comments.index']
      destroy: typeof routes['admin.comments.destroy']
    }
    discussions: {
      index: typeof routes['admin.discussions.index']
      destroy: typeof routes['admin.discussions.destroy']
    }
    roles: typeof routes['admin.roles'] & {
      index: typeof routes['admin.roles.index']
      create: typeof routes['admin.roles.create']
      store: typeof routes['admin.roles.store']
      edit: typeof routes['admin.roles.edit']
      update: typeof routes['admin.roles.update']
      destroy: typeof routes['admin.roles.destroy']
    }
    assets: {
      index: typeof routes['admin.assets.index']
      apiIndex: typeof routes['admin.assets.api_index']
      store: typeof routes['admin.assets.store']
      destroy: typeof routes['admin.assets.destroy']
    }
    courses: {
      index: typeof routes['admin.courses.index']
      create: typeof routes['admin.courses.create']
      store: typeof routes['admin.courses.store']
      edit: typeof routes['admin.courses.edit']
      update: typeof routes['admin.courses.update']
      destroy: typeof routes['admin.courses.destroy']
      storeModule: typeof routes['admin.courses.store_module']
      updateModule: typeof routes['admin.courses.update_module']
      destroyModule: typeof routes['admin.courses.destroy_module']
      updateModuleContent: typeof routes['admin.courses.update_module_content']
      reorderModules: typeof routes['admin.courses.reorder_modules']
    }
    series: {
      index: typeof routes['admin.series.index']
      create: typeof routes['admin.series.create']
      store: typeof routes['admin.series.store']
      edit: typeof routes['admin.series.edit']
      update: typeof routes['admin.series.update']
      destroy: typeof routes['admin.series.destroy']
      storePost: typeof routes['admin.series.store_post']
      reorderPosts: typeof routes['admin.series.reorder_posts']
      destroyPost: typeof routes['admin.series.destroy_post']
    }
    playlists: {
      index: typeof routes['admin.playlists.index']
      create: typeof routes['admin.playlists.create']
      store: typeof routes['admin.playlists.store']
      edit: typeof routes['admin.playlists.edit']
      update: typeof routes['admin.playlists.update']
      destroy: typeof routes['admin.playlists.destroy']
      storePost: typeof routes['admin.playlists.store_post']
      reorderPosts: typeof routes['admin.playlists.reorder_posts']
      destroyPost: typeof routes['admin.playlists.destroy_post']
    }
    paths: {
      index: typeof routes['admin.paths.index']
      create: typeof routes['admin.paths.create']
      store: typeof routes['admin.paths.store']
      edit: typeof routes['admin.paths.edit']
      update: typeof routes['admin.paths.update']
      destroy: typeof routes['admin.paths.destroy']
      storeCourse: typeof routes['admin.paths.store_course']
      reorderCourses: typeof routes['admin.paths.reorder_courses']
      destroyCourse: typeof routes['admin.paths.destroy_course']
    }
    accessLevels: {
      index: typeof routes['admin.access_levels.index']
      create: typeof routes['admin.access_levels.create']
      store: typeof routes['admin.access_levels.store']
      edit: typeof routes['admin.access_levels.edit']
      update: typeof routes['admin.access_levels.update']
      destroy: typeof routes['admin.access_levels.destroy']
      reorder: typeof routes['admin.access_levels.reorder']
    }
    settings: {
      index: typeof routes['admin.settings.index']
      update: typeof routes['admin.settings.update']
    }
    ai: {
      videoChapters: typeof routes['admin.ai.video_chapters']
      bodyOverview: typeof routes['admin.ai.body_overview']
    }
    memberEnrollments: {
      index: typeof routes['admin.memberEnrollments.index']
      show: typeof routes['admin.memberEnrollments.show']
      approve: typeof routes['admin.memberEnrollments.approve']
      reject: typeof routes['admin.memberEnrollments.reject']
      revoke: typeof routes['admin.memberEnrollments.revoke']
    }
    candidates: {
      index: typeof routes['admin.candidates.index']
      show: typeof routes['admin.candidates.show']
      approve: typeof routes['admin.candidates.approve']
      reject: typeof routes['admin.candidates.reject']
      remark: typeof routes['admin.candidates.remark']
    }
  }
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  forgetPasswords: typeof routes['forget_passwords'] & {
    index: typeof routes['forget_passwords.index']
  }
  resetPasswords: typeof routes['reset_passwords'] & {
    index: typeof routes['reset_passwords.index']
  }
  auth: {
    verify: {
      notice: typeof routes['auth.verify.notice']
      resend: typeof routes['auth.verify.resend']
      handle: typeof routes['auth.verify.handle']
    }
  }
  onboarding: {
    index: typeof routes['onboarding.index']
    personalInfo: typeof routes['onboarding.personalInfo']
    documents: {
      upload: typeof routes['onboarding.documents.upload']
      remove: typeof routes['onboarding.documents.remove']
    }
    introVideo: typeof routes['onboarding.introVideo']
    kyc: typeof routes['onboarding.kyc']
    purpose: typeof routes['onboarding.purpose']
    submit: typeof routes['onboarding.submit']
  }
  application: {
    status: typeof routes['application.status']
  }
  series: {
    index: typeof routes['series.index']
    show: typeof routes['series.show']
    memberEnrollments: {
      store: typeof routes['series.memberEnrollments.store']
      update: typeof routes['series.memberEnrollments.update']
    }
  }
  courses: {
    show: typeof routes['courses.show']
    memberEnrollments: {
      store: typeof routes['courses.memberEnrollments.store']
      update: typeof routes['courses.memberEnrollments.update']
    }
  }
  memberEnrollments: {
    index: typeof routes['memberEnrollments.index']
  }
  dashboard: typeof routes['dashboard']
  myProgress: typeof routes['my-progress']
  lessons: {
    index: typeof routes['lessons.index']
    setDefaultPanel: typeof routes['lessons.setDefaultPanel']
    watchlist: typeof routes['lessons.watchlist']
    autoplay: typeof routes['lessons.autoplay']
    show: typeof routes['lessons.show']
    assessment: typeof routes['lessons.assessment'] & {
      submit: typeof routes['lessons.assessment.submit']
    }
  }
  assessments: {
    history: typeof routes['assessments.history']
  }
  users: {
    watchlist: typeof routes['users.watchlist']
  }
  progress: {
    store: typeof routes['progress.store']
    toggle: typeof routes['progress.toggle']
  }
  settings: {
    index: typeof routes['settings.index']
    show: typeof routes['settings.show']
    updateProfile: typeof routes['settings.updateProfile']
    updateUsername: typeof routes['settings.updateUsername']
    updateEmail: typeof routes['settings.updateEmail']
    updatePassword: typeof routes['settings.updatePassword']
    updateNotifications: typeof routes['settings.updateNotifications']
    destroy: typeof routes['settings.destroy']
  }
  topics: {
    index: typeof routes['topics.index']
    show: typeof routes['topics.show']
  }
  blogs: {
    index: typeof routes['blogs.index']
    show: typeof routes['blogs.show']
  }
  posts: {
    index: typeof routes['posts.index']
    show: typeof routes['posts.show']
  }
  comments: {
    store: typeof routes['comments.store']
    update: typeof routes['comments.update']
    destroy: typeof routes['comments.destroy']
    toggleVote: typeof routes['comments.toggleVote']
  }
  discussions: {
    index: typeof routes['discussions.index']
    create: typeof routes['discussions.create']
    store: typeof routes['discussions.store']
    show: typeof routes['discussions.show']
    edit: typeof routes['discussions.edit']
    update: typeof routes['discussions.update']
    destroy: typeof routes['discussions.destroy']
    toggleVote: typeof routes['discussions.toggleVote']
    toggleSolved: typeof routes['discussions.toggleSolved']
  }
  search: typeof routes['search']
  rss: typeof routes['rss']
  sitemap: typeof routes['sitemap']
  profiles: {
    show: typeof routes['profiles.show']
  }
  attachments: typeof routes['attachments']
}
