/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'drive.fs.serve': {
    methods: ["GET","HEAD"]
    pattern: '/uploads/*'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { '*': ParamValue[] }
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'admin.dashboard.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/dashboard_controller').default['index']>>>
    }
  }
  'admin.posts.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/posts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/post').filterPostsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.posts.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/posts/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['create']>>>
    }
  }
  'admin.posts.store': {
    methods: ["POST"]
    pattern: '/admin/posts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/post').createPostValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/post').createPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.posts.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/posts/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['edit']>>>
    }
  }
  'admin.posts.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/posts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/post').updatePostValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/post').updatePostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.posts.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/posts/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/posts_controller').default['destroy']>>>
    }
  }
  'admin.taxonomies.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/taxonomies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/taxonomy').listTaxonomyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.taxonomies.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/taxonomies/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['create']>>>
    }
  }
  'admin.taxonomies.store': {
    methods: ["POST"]
    pattern: '/admin/taxonomies'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/taxonomy').createTaxonomyValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/taxonomy').createTaxonomyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.taxonomies.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/taxonomies/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['edit']>>>
    }
  }
  'admin.taxonomies.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/taxonomies/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/taxonomy').updateTaxonomyValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/taxonomy').updateTaxonomyValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.taxonomies.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/taxonomies/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['destroy']>>>
    }
  }
  'admin.taxonomies.api_index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/api/taxonomies'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['apiIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/taxonomies_controller').default['apiIndex']>>>
    }
  }
  'admin.taxonomy_contents.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/taxonomies/:id/content'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/taxonomy_contents_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/taxonomy_contents_controller').default['edit']>>>
    }
  }
  'admin.taxonomy_contents.update': {
    methods: ["PUT"]
    pattern: '/admin/taxonomies/:id/content'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/taxonomy').taxonomyContentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/taxonomy').taxonomyContentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/taxonomy_contents_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/taxonomy_contents_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/user').userIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.show': {
    methods: ["GET","HEAD"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['show']>>>
    }
  }
  'admin.users.role': {
    methods: ["PATCH"]
    pattern: '/admin/users/:id/role'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').userRoleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/user').userRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['role']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['role']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.users.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/users_controller').default['destroy']>>>
    }
  }
  'admin.comments.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/comments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/comment').commentIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/comments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/comments_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.comments.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/comments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/comments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/comments_controller').default['destroy']>>>
    }
  }
  'admin.discussions.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/discussions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/discussion').discussionSearchValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/discussions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/discussions_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.discussions.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/discussions/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/discussions_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/discussions_controller').default['destroy']>>>
    }
  }
  'admin.roles.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/roles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/role').roleIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.roles.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/roles/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['create']>>>
    }
  }
  'admin.roles.store': {
    methods: ["POST"]
    pattern: '/admin/roles'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/role').createRoleValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/role').createRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.roles.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/roles/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['edit']>>>
    }
  }
  'admin.roles.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/roles/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/role').updateRoleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/role').updateRoleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.roles.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/roles/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['destroy']>>>
    }
  }
  'admin.roles': {
    methods: ["GET","HEAD"]
    pattern: '/admin/all-roles'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['apiIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/roles_controller').default['apiIndex']>>>
    }
  }
  'admin.assets.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/assets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/asset').assetIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/assets_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/assets_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.assets.api_index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/api/assets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/asset').assetIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/assets_controller').default['apiIndex']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/assets_controller').default['apiIndex']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.assets.store': {
    methods: ["POST"]
    pattern: '/admin/assets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/assets_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/assets_controller').default['store']>>>
    }
  }
  'admin.assets.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/assets/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/assets_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/assets_controller').default['destroy']>>>
    }
  }
  'admin.courses.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/courses'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/course').courseIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.courses.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/courses/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['create']>>>
    }
  }
  'admin.courses.store': {
    methods: ["POST"]
    pattern: '/admin/courses'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/course').createCourseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/course').createCourseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.courses.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/courses/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['edit']>>>
    }
  }
  'admin.courses.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/courses/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/course').updateCourseValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/course').updateCourseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.courses.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/courses/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['destroy']>>>
    }
  }
  'admin.courses.store_module': {
    methods: ["POST"]
    pattern: '/admin/courses/:id/modules'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/course').courseModuleValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/course').courseModuleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['storeModule']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['storeModule']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.courses.update_module': {
    methods: ["PUT"]
    pattern: '/admin/courses/:courseId/modules/:moduleId'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/course').courseModuleValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { courseId: ParamValue; moduleId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/course').courseModuleValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['updateModule']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['updateModule']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.courses.destroy_module': {
    methods: ["DELETE"]
    pattern: '/admin/courses/:courseId/modules/:moduleId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { courseId: ParamValue; moduleId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['destroyModule']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['destroyModule']>>>
    }
  }
  'admin.courses.update_module_content': {
    methods: ["PUT"]
    pattern: '/admin/courses/:courseId/modules/:moduleId/content'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/course').courseModuleContentValidator)>>
      paramsTuple: [ParamValue, ParamValue]
      params: { courseId: ParamValue; moduleId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/course').courseModuleContentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['updateModuleContent']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['updateModuleContent']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.courses.reorder_modules': {
    methods: ["PUT"]
    pattern: '/admin/courses/:id/modules/order'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/course').reorderCourseModulesValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/course').reorderCourseModulesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['reorderModules']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/courses_controller').default['reorderModules']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.series.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/series'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/series').seriesIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.series.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/series/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['create']>>>
    }
  }
  'admin.series.store': {
    methods: ["POST"]
    pattern: '/admin/series'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/series').createSeriesValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/series').createSeriesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.series.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/series/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['edit']>>>
    }
  }
  'admin.series.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/series/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/series').updateSeriesValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/series').updateSeriesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.series.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/series/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['destroy']>>>
    }
  }
  'admin.series.store_post': {
    methods: ["POST"]
    pattern: '/admin/series/:id/posts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/series').seriesPostValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/series').seriesPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['storePost']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['storePost']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.series.reorder_posts': {
    methods: ["PUT"]
    pattern: '/admin/series/:id/posts/order'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/series').reorderSeriesPostsValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/series').reorderSeriesPostsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['reorderPosts']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['reorderPosts']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.series.destroy_post': {
    methods: ["DELETE"]
    pattern: '/admin/series/:seriesId/posts/:postId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { seriesId: ParamValue; postId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['destroyPost']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/series_controller').default['destroyPost']>>>
    }
  }
  'admin.playlists.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/playlists'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/playlist').playlistIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.playlists.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/playlists/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['create']>>>
    }
  }
  'admin.playlists.store': {
    methods: ["POST"]
    pattern: '/admin/playlists'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/playlist').createPlaylistValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/playlist').createPlaylistValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.playlists.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/playlists/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['edit']>>>
    }
  }
  'admin.playlists.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/playlists/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/playlist').updatePlaylistValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/playlist').updatePlaylistValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.playlists.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/playlists/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['destroy']>>>
    }
  }
  'admin.playlists.store_post': {
    methods: ["POST"]
    pattern: '/admin/playlists/:id/posts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/playlist').playlistPostValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/playlist').playlistPostValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['storePost']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['storePost']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.playlists.reorder_posts': {
    methods: ["PUT"]
    pattern: '/admin/playlists/:id/posts/order'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/playlist').reorderPlaylistPostsValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/playlist').reorderPlaylistPostsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['reorderPosts']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['reorderPosts']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.playlists.destroy_post': {
    methods: ["DELETE"]
    pattern: '/admin/playlists/:playlistId/posts/:postId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { playlistId: ParamValue; postId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['destroyPost']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/playlists_controller').default['destroyPost']>>>
    }
  }
  'admin.paths.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/paths'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/path').pathIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.paths.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/paths/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['create']>>>
    }
  }
  'admin.paths.store': {
    methods: ["POST"]
    pattern: '/admin/paths'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/path').createPathValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/path').createPathValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.paths.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/paths/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['edit']>>>
    }
  }
  'admin.paths.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/paths/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/path').updatePathValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/path').updatePathValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.paths.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/paths/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['destroy']>>>
    }
  }
  'admin.paths.store_course': {
    methods: ["POST"]
    pattern: '/admin/paths/:id/courses'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/path').pathCourseValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/path').pathCourseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['storeCourse']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['storeCourse']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.paths.reorder_courses': {
    methods: ["PUT"]
    pattern: '/admin/paths/:id/courses/order'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/path').reorderPathCoursesValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/path').reorderPathCoursesValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['reorderCourses']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['reorderCourses']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.paths.destroy_course': {
    methods: ["DELETE"]
    pattern: '/admin/paths/:pathId/courses/:courseId'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { pathId: ParamValue; courseId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['destroyCourse']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/paths_controller').default['destroyCourse']>>>
    }
  }
  'admin.access_levels.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/access-levels'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/access_level').accessLevelIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.access_levels.create': {
    methods: ["GET","HEAD"]
    pattern: '/admin/access-levels/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['create']>>>
    }
  }
  'admin.access_levels.store': {
    methods: ["POST"]
    pattern: '/admin/access-levels'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/access_level').createAccessLevelValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/access_level').createAccessLevelValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.access_levels.edit': {
    methods: ["GET","HEAD"]
    pattern: '/admin/access-levels/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['edit']>>>
    }
  }
  'admin.access_levels.update': {
    methods: ["PUT","PATCH"]
    pattern: '/admin/access-levels/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/access_level').updateAccessLevelValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/access_level').updateAccessLevelValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.access_levels.destroy': {
    methods: ["DELETE"]
    pattern: '/admin/access-levels/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['destroy']>>>
    }
  }
  'admin.access_levels.reorder': {
    methods: ["PUT"]
    pattern: '/admin/access-levels/order'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/access_level').reorderAccessLevelsValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/access_level').reorderAccessLevelsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['reorder']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/access_levels_controller').default['reorder']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['index']>>>
    }
  }
  'admin.settings.update': {
    methods: ["POST"]
    pattern: '/admin/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/settings_controller').default['update']>>>
    }
  }
  'admin.ai.video_chapters': {
    methods: ["POST"]
    pattern: '/admin/ai/videos/:videoId/chapters'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { videoId: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/ai_controller').default['videoChapters']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/ai_controller').default['videoChapters']>>>
    }
  }
  'admin.ai.body_overview': {
    methods: ["POST"]
    pattern: '/admin/ai/lessons/:lessonId/body-overview'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/ai').aiBodyOverviewValidator)>>
      paramsTuple: [ParamValue]
      params: { lessonId: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/ai').aiBodyOverviewValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/ai_controller').default['bodyOverview']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/ai_controller').default['bodyOverview']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.memberEnrollments.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/member-enrollments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/member_enrollment').memberEnrollmentIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.memberEnrollments.show': {
    methods: ["GET","HEAD"]
    pattern: '/admin/member-enrollments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['show']>>>
    }
  }
  'admin.memberEnrollments.approve': {
    methods: ["POST"]
    pattern: '/admin/member-enrollments/:id/approve'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['approve']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['approve']>>>
    }
  }
  'admin.memberEnrollments.reject': {
    methods: ["POST"]
    pattern: '/admin/member-enrollments/:id/reject'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/member_enrollment').rejectMemberEnrollmentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/member_enrollment').rejectMemberEnrollmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['reject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['reject']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.memberEnrollments.revoke': {
    methods: ["POST"]
    pattern: '/admin/member-enrollments/:id/revoke'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/member_enrollment').revokeMemberEnrollmentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/member_enrollment').revokeMemberEnrollmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['revoke']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/member_enrollments_controller').default['revoke']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'admin.candidates.index': {
    methods: ["GET","HEAD"]
    pattern: '/admin/candidates'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['index']>>>
    }
  }
  'admin.candidates.show': {
    methods: ["GET","HEAD"]
    pattern: '/admin/candidates/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['show']>>>
    }
  }
  'admin.candidates.approve': {
    methods: ["POST"]
    pattern: '/admin/candidates/:id/approve'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['approve']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['approve']>>>
    }
  }
  'admin.candidates.reject': {
    methods: ["POST"]
    pattern: '/admin/candidates/:id/reject'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['reject']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['reject']>>>
    }
  }
  'admin.candidates.remark': {
    methods: ["POST"]
    pattern: '/admin/candidates/:id/remark'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['remark']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/admin/candidates_controller').default['remark']>>>
    }
  }
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/home_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/home_controller').default['index']>>>
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'forget_passwords.index': {
    methods: ["GET","HEAD"]
    pattern: '/forget-password'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/forget_passwords_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/forget_passwords_controller').default['index']>>>
    }
  }
  'forget_passwords': {
    methods: ["POST"]
    pattern: '/forget-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').forgetPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').forgetPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/forget_passwords_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/forget_passwords_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'reset_passwords.index': {
    methods: ["GET","HEAD"]
    pattern: '/reset-password/:email'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { email: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/reset_passwords_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/reset_passwords_controller').default['index']>>>
    }
  }
  'reset_passwords': {
    methods: ["POST"]
    pattern: '/reset-password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').resetPasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').resetPasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/reset_passwords_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/reset_passwords_controller').default['handle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'auth.verify.notice': {
    methods: ["GET","HEAD"]
    pattern: '/verify-email'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/email_verification_controller').default['notice']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/email_verification_controller').default['notice']>>>
    }
  }
  'auth.verify.resend': {
    methods: ["POST"]
    pattern: '/verify-email/resend'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/email_verification_controller').default['resend']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/email_verification_controller').default['resend']>>>
    }
  }
  'auth.verify.handle': {
    methods: ["GET","HEAD"]
    pattern: '/verify-email/:email'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { email: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/email_verification_controller').default['verify']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/email_verification_controller').default['verify']>>>
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/session_controller').default['destroy']>>>
    }
  }
  'onboarding.index': {
    methods: ["GET","HEAD"]
    pattern: '/onboarding'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['show']>>>
    }
  }
  'onboarding.personalInfo': {
    methods: ["POST"]
    pattern: '/onboarding/personal-info'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['savePersonalInfo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['savePersonalInfo']>>>
    }
  }
  'onboarding.documents.upload': {
    methods: ["POST"]
    pattern: '/onboarding/documents/:field'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { field: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['uploadDocument']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['uploadDocument']>>>
    }
  }
  'onboarding.documents.remove': {
    methods: ["POST"]
    pattern: '/onboarding/documents/remove'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['removeDocument']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['removeDocument']>>>
    }
  }
  'onboarding.introVideo': {
    methods: ["POST"]
    pattern: '/onboarding/intro-video'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['uploadIntroVideo']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['uploadIntroVideo']>>>
    }
  }
  'onboarding.kyc': {
    methods: ["POST"]
    pattern: '/onboarding/kyc'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['uploadKyc']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['uploadKyc']>>>
    }
  }
  'onboarding.purpose': {
    methods: ["POST"]
    pattern: '/onboarding/purpose'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['savePurpose']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['savePurpose']>>>
    }
  }
  'onboarding.submit': {
    methods: ["POST"]
    pattern: '/onboarding/submit'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['submit']>>>
    }
  }
  'application.status': {
    methods: ["GET","HEAD"]
    pattern: '/application/status'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['status']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/auth/onboarding_controller').default['status']>>>
    }
  }
  'series.index': {
    methods: ["GET","HEAD"]
    pattern: '/series'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/series').seriesIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/series_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/series_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'series.show': {
    methods: ["GET","HEAD"]
    pattern: '/series/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/series_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/series_controller').default['show']>>>
    }
  }
  'courses.show': {
    methods: ["GET","HEAD"]
    pattern: '/courses/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/courses_controller').default['show']>>>
    }
  }
  'memberEnrollments.index': {
    methods: ["GET","HEAD"]
    pattern: '/my-enrollments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['index']>>>
    }
  }
  'courses.memberEnrollments.store': {
    methods: ["POST"]
    pattern: '/courses/:slug/member-enrollments'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['storeCourse']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['storeCourse']>>>
    }
  }
  'courses.memberEnrollments.update': {
    methods: ["PATCH"]
    pattern: '/courses/:slug/member-enrollments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { slug: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['updateCourse']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['updateCourse']>>>
    }
  }
  'series.memberEnrollments.store': {
    methods: ["POST"]
    pattern: '/series/:slug/member-enrollments'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['storeSeries']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['storeSeries']>>>
    }
  }
  'series.memberEnrollments.update': {
    methods: ["PATCH"]
    pattern: '/series/:slug/member-enrollments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue, ParamValue]
      params: { slug: ParamValue; id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['updateSeries']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/member_enrollments_controller').default['updateSeries']>>>
    }
  }
  'dashboard': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'lessons.index': {
    methods: ["GET","HEAD"]
    pattern: '/lessons'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/lesson').lessonIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'lessons.setDefaultPanel': {
    methods: ["PATCH"]
    pattern: '/lessons/set-default-panel'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/lesson').defaultLessonPanelValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/lesson').defaultLessonPanelValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lesson_preferences_controller').default['setDefaultPanel']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lesson_preferences_controller').default['setDefaultPanel']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'lessons.watchlist': {
    methods: ["PATCH"]
    pattern: '/lessons/:slug/watchlist'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/watchlists_controller').default['toggleLesson']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/watchlists_controller').default['toggleLesson']>>>
    }
  }
  'lessons.autoplay': {
    methods: ["PATCH"]
    pattern: '/lessons/:slug/autoplay'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lesson_preferences_controller').default['toggleAutoplay']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lesson_preferences_controller').default['toggleAutoplay']>>>
    }
  }
  'lessons.show': {
    methods: ["GET","HEAD"]
    pattern: '/lessons/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/lessons_controller').default['show']>>>
    }
  }
  'lessons.assessment': {
    methods: ["GET","HEAD"]
    pattern: '/lessons/:slug/assessment'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['show']>>>
    }
  }
  'lessons.assessment.submit': {
    methods: ["POST"]
    pattern: '/lessons/:slug/assessment/submit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['submit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/assessments_controller').default['submit']>>>
    }
  }
  'users.watchlist': {
    methods: ["GET","HEAD"]
    pattern: '/users/watchlist'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/watchlists_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/watchlists_controller').default['index']>>>
    }
  }
  'progress.store': {
    methods: ["POST"]
    pattern: '/progress'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/lesson').progressValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/lesson').progressValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/progress_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/progress_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'progress.toggle': {
    methods: ["PATCH"]
    pattern: '/progress/toggle'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/lesson').progressValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/lesson').progressValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/progress_controller').default['toggle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/progress_controller').default['toggle']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
    }
  }
  'settings.show': {
    methods: ["GET","HEAD"]
    pattern: '/settings/:section'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { section: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
    }
  }
  'settings.updateProfile': {
    methods: ["PUT"]
    pattern: '/settings/profile'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/profile').profileUpdateValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/profile').profileUpdateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateProfile']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateProfile']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.updateUsername': {
    methods: ["PUT"]
    pattern: '/settings/username'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateUsernameValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateUsernameValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateUsername']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateUsername']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.updateEmail': {
    methods: ["PUT"]
    pattern: '/settings/email'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updateEmailValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updateEmailValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateEmail']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateEmail']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.updatePassword': {
    methods: ["PUT"]
    pattern: '/settings/password'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').updatePasswordValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').updatePasswordValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updatePassword']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updatePassword']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.updateNotifications': {
    methods: ["PUT"]
    pattern: '/settings/notifications'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/profile').emailNotificationValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/profile').emailNotificationValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateNotifications']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['updateNotifications']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'settings.destroy': {
    methods: ["DELETE"]
    pattern: '/settings/account'
    types: {
      body: ExtractBody<InferInput<(typeof import('@vinejs/vine').default)['compile']>|InferInput<(typeof import('@vinejs/vine').default)['object']>|InferInput<(typeof import('@vinejs/vine').default)['string']>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('@vinejs/vine').default)['compile']>|InferInput<(typeof import('@vinejs/vine').default)['object']>|InferInput<(typeof import('@vinejs/vine').default)['string']>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['destroy']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'topics.index': {
    methods: ["GET","HEAD"]
    pattern: '/topics'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/topics_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/topics_controller').default['index']>>>
    }
  }
  'topics.show': {
    methods: ["GET","HEAD"]
    pattern: '/topics/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/topics_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/topics_controller').default['show']>>>
    }
  }
  'blogs.index': {
    methods: ["GET","HEAD"]
    pattern: '/blog'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/blog').blogIndexValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/blogs_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/blogs_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'blogs.show': {
    methods: ["GET","HEAD"]
    pattern: '/blog/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/blogs_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/blogs_controller').default['show']>>>
    }
  }
  'posts.index': {
    methods: ["GET","HEAD"]
    pattern: '/posts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/post').filterPostsValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'posts.show': {
    methods: ["GET","HEAD"]
    pattern: '/posts/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/posts_controller').default['show']>>>
    }
  }
  'comments.store': {
    methods: ["POST"]
    pattern: '/comments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/comment').commentStoreValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/comment').commentStoreValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'comments.update': {
    methods: ["PUT","PATCH"]
    pattern: '/comments/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/comment').commentUpdateValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/comment').commentUpdateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'comments.destroy': {
    methods: ["DELETE"]
    pattern: '/comments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['destroy']>>>
    }
  }
  'comments.toggleVote': {
    methods: ["POST"]
    pattern: '/comments/:id/vote'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['toggleVote']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/comments_controller').default['toggleVote']>>>
    }
  }
  'discussions.index': {
    methods: ["GET","HEAD"]
    pattern: '/forum'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/discussion').discussionSearchValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'discussions.create': {
    methods: ["GET","HEAD"]
    pattern: '/forum/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['create']>>>
    }
  }
  'discussions.store': {
    methods: ["POST"]
    pattern: '/forum'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/discussion').createDiscussionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/discussion').createDiscussionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'discussions.show': {
    methods: ["GET","HEAD"]
    pattern: '/forum/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['show']>>>
    }
  }
  'discussions.edit': {
    methods: ["GET","HEAD"]
    pattern: '/forum/:slug/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['edit']>>>
    }
  }
  'discussions.update': {
    methods: ["PUT"]
    pattern: '/forum/:slug'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/discussion').updateDiscussionValidator)>>
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/discussion').updateDiscussionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'discussions.destroy': {
    methods: ["DELETE"]
    pattern: '/forum/:slug'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['destroy']>>>
    }
  }
  'discussions.toggleVote': {
    methods: ["POST"]
    pattern: '/forum/:id/vote'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['toggleVote']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['toggleVote']>>>
    }
  }
  'discussions.toggleSolved': {
    methods: ["POST"]
    pattern: '/forum/:slug/solved'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { slug: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['toggleSolved']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/discussions_controller').default['toggleSolved']>>>
    }
  }
  'search': {
    methods: ["GET","HEAD"]
    pattern: '/search'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: ExtractQueryForGet<InferInput<(typeof import('#validators/search').searchValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/search_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/search_controller').default['index']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'rss': {
    methods: ["GET","HEAD"]
    pattern: '/rss'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/rss_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/rss_controller').default['index']>>>
    }
  }
  'sitemap': {
    methods: ["GET","HEAD"]
    pattern: '/sitemap.xml'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/sitemap_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/sitemap_controller').default['index']>>>
    }
  }
  'profiles.show': {
    methods: ["GET","HEAD"]
    pattern: '/:handle'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { handle: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/profiles_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/profiles_controller').default['show']>>>
    }
  }
  'attachments': {
    methods: ["GET","HEAD"]
    pattern: '/attachments/:key/:name?'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { key: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('@jrmc/adonis-attachment/controllers/attachments_controller').default['handle']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('@jrmc/adonis-attachment/controllers/attachments_controller').default['handle']>>>
    }
  }
}
