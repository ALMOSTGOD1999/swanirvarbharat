import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { cuid } from '#utils/id'
import User from '#models/user'
import Taxonomy from '#models/taxonomy'
import Post from '#models/post'
import { Roles } from '#enums/roles'
import { States } from '#enums/states'
import { PostTypes } from '#enums/posts'
import { TaxonomyTypes } from '#enums/taxonomy'

const now = () => DateTime.now().toJSDate()

const POSTS = [
  {
    title: 'Mastering English Tenses: A Practical Guide',
    description:
      'A clear, beginner-friendly breakdown of the 12 English tenses with examples for everyday use.',
    body: '<p>English tenses are the foundation of clear communication. This guide walks through the 12 tenses — past, present, and future in their simple, continuous, perfect, and perfect continuous forms — with examples drawn from real conversations.</p><p>You will learn when to use each tense, common signal words that hint at the right choice, and how to avoid mixing them up in speech and writing.</p>',
  },
  {
    title: 'Understanding Subject-Verb Agreement in English',
    description:
      'Simple rules and tricky exceptions to make sure your subjects and verbs always agree.',
    body: '<p>Subject-verb agreement is one of the most common sources of grammatical errors. This post covers the core rules for singular and plural subjects, collective nouns, indefinite pronouns, and tricky cases like "neither/nor" and "either/or".</p><p>Master these rules and your sentences will sound natural and correct in any hospitality or professional setting.</p>',
  },
  {
    title: 'Common English Grammar Mistakes and How to Avoid Them',
    description:
      'Spot the grammar errors that trip up even fluent speakers — and learn the quick fixes.',
    body: '<p>Even confident English speakers slip up on a handful of recurring mistakes. This post highlights frequent errors with articles, prepositions, verb forms, and word order, then shows the simple corrections that make your English sound polished.</p><p>Use the checklist at the end to review your own writing and catch these issues before they reach a guest or manager.</p>',
  },
]

export default class EnglishGrammarPostsSeeder extends BaseSeeder {
  async run() {
    // Find the English Grammar taxonomy (the slug shown in the URL is a
    // nanoid-based shortId slug, but we resolve by name for stability).
    const topic = await Taxonomy.query()
      .where('type', TaxonomyTypes.CONTENT)
      .whereILike('name', 'English Grammar')
      .first()

    if (!topic) {
      // Nothing to attach posts to — skip without erroring.
      return
    }

    // Pick an author: prefer the admin, otherwise the topic owner, otherwise
    // any user. Falls back gracefully on fresh databases.
    const admin =
      (await User.query().where('roleId', Roles.ADMIN).first()) ??
      (topic.ownerId ? await User.find(topic.ownerId) : undefined) ??
      (await User.query().orderBy('createdAt', 'asc').first())

    if (!admin) {
      return
    }

    // publishedPublic scope requires published_at <= now - 14 days.
    const publishedAt = DateTime.now().minus({ days: 20 })

    for (const item of POSTS) {
      // Idempotent: skip if a post with the same title already exists.
      const existing = await Post.query().where('title', item.title).first()
      if (existing) {
        // Ensure the existing post is linked to the English Grammar topic.
        const link = await db
          .from('post_taxonomies')
          .where('post_id', existing.id)
          .where('taxonomy_id', topic.id)
          .first()
        if (!link) {
          await db.table('post_taxonomies').insert({
            id: cuid(),
            post_id: existing.id,
            taxonomy_id: topic.id,
            sort_order: 0,
            created_at: now(),
            updated_at: now(),
          })
        }
        continue
      }

      const post = await Post.create({
        title: item.title,
        description: item.description,
        body: item.body,
        postType: PostTypes.BLOG,
        state: States.PUBLIC,
        isPersonal: false,
        publishedAt,
      })

      await db.table('author_posts').insert({
        id: cuid(),
        user_id: admin.id,
        post_id: post.id,
        created_at: now(),
        updated_at: now(),
      })

      await db.table('post_taxonomies').insert({
        id: cuid(),
        post_id: post.id,
        taxonomy_id: topic.id,
        sort_order: 0,
        created_at: now(),
        updated_at: now(),
      })
    }
  }
}
