import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'
import { cuid } from '#utils/id'
import User from '#models/user'
import Profile from '#models/profile'
import Taxonomy from '#models/taxonomy'
import Post from '#models/post'
import Series from '#models/series'
import { Roles } from '#enums/roles'
import { States } from '#enums/states'
import { PostTypes } from '#enums/posts'
import { VideoTypes } from '#enums/videos'
import { TaxonomyTypes } from '#enums/taxonomy'

const now = () => DateTime.now().toJSDate()
const daysAgo = (days: number) => DateTime.now().minus({ days }).toJSDate()

export default class ContentSeeder extends BaseSeeder {
  async run() {
    // ------------------------------------------------------------------
    // Clean up existing seeded content (for re-runs)
    // ------------------------------------------------------------------
    await db.rawQuery('DELETE FROM member_enrollments')
    await db.rawQuery('DELETE FROM post_chapters')
    await db.rawQuery('DELETE FROM playlists')
    await db.rawQuery('DELETE FROM series_posts')
    await db.rawQuery('DELETE FROM series_taxonomies')
    await db.rawQuery('DELETE FROM post_taxonomies')
    await db.rawQuery('DELETE FROM author_posts')
    await db.rawQuery('DELETE FROM course_module_posts')
    await db.rawQuery('DELETE FROM course_modules')
    await db.rawQuery('DELETE FROM course_taxonomies')
    await db.rawQuery('DELETE FROM courses')
    await db.rawQuery('DELETE FROM path_courses')
    await db.rawQuery('DELETE FROM paths')
    await db.rawQuery('DELETE FROM watchlists')
    await db.rawQuery('DELETE FROM comment_votes')
    await db.rawQuery('DELETE FROM comments')
    await db.rawQuery('DELETE FROM discussion_votes')
    await db.rawQuery('DELETE FROM discussions')
    await Series.query().delete()
    await Post.query().delete()
    await Taxonomy.query().delete()

    // Remove existing admin user + profile if re-running
    const existingAdmin = await User.findBy('email', 'admin@swanirvarbharat.com')
    if (existingAdmin) {
      await Profile.query().where('id', existingAdmin.id).delete()
      await existingAdmin.delete()
    }

    // ------------------------------------------------------------------
    // 1. Admin user + profile
    // ------------------------------------------------------------------
    const admin = await User.create({
      username: 'admin',
      email: 'admin@swanirvarbharat.com',
      password: 'swanirvarbharat',
      roleId: Roles.ADMIN,
    })

    await Profile.create({
      id: admin.id,
      name: 'Admin',
      biography:
        'Administrator and content creator at Swanirvar Bharat. Passionate about hospitality education and English language training.',
      location: 'India',
      website: 'https://swanirvarbharat.com',
    })

    // ------------------------------------------------------------------
    // 2. Topics (taxonomies)
    // ------------------------------------------------------------------
    const topicsData = [
      {
        name: 'Hotel Management',
        description:
          'Comprehensive knowledge of hotel operations, administration, and management principles.',
      },
      {
        name: 'Front Office Operations',
        description:
          'Managing reservations, check-ins, check-outs, and guest relations at the front desk.',
      },
      {
        name: 'Housekeeping',
        description:
          'Maintaining cleanliness, hygiene, and room standards in hospitality establishments.',
      },
      {
        name: 'Food & Beverage Service',
        description: 'Restaurant service, menu planning, banquet operations, and F&B management.',
      },
      {
        name: 'Hospitality Marketing',
        description:
          'Marketing strategies, branding, and revenue management for the hospitality industry.',
      },
      {
        name: 'Spoken English - Basics',
        description: 'Foundational English speaking skills for everyday conversations.',
      },
      {
        name: 'Spoken English - Advanced',
        description: 'Advanced English communication, fluency, and professional speaking skills.',
      },
      {
        name: 'English Grammar',
        description: 'Understanding English grammar rules, sentence structure, and usage.',
      },
    ]

    const topics = await Promise.all(
      topicsData.map((topic) =>
        Taxonomy.create({
          name: topic.name,
          description: topic.description,
          type: TaxonomyTypes.CONTENT,
          ownerId: admin.id,
        })
      )
    )

    const topicByName = (name: string) => topics.find((t) => t.name === name)!

    // ------------------------------------------------------------------
    // 3. Blog posts (6)
    // ------------------------------------------------------------------
    const blogPosts = [
      {
        title: 'Essential Hotel Management Skills for Beginners',
        description:
          'A comprehensive guide to the core skills needed for a successful career in hotel management.',
        body: '<p>Hotel management requires a diverse skill set spanning administration, customer service, financial management, and team leadership. In this guide, we cover the fundamentals every aspiring hotel manager should master.</p><p>From understanding front desk operations to managing housekeeping schedules, you will learn the key areas that define excellence in hospitality management.</p>',
        topics: ['Hotel Management'],
      },
      {
        title: 'Mastering Front Office Operations',
        description:
          'Learn the ins and outs of front desk management, reservations, and guest relations.',
        body: '<p>The front office is the nerve center of any hotel. This post explores best practices for handling reservations, managing check-ins and check-outs, and delivering exceptional guest experiences from the moment they arrive.</p><p>We also cover modern hospitality technology, including PMS systems and online booking channels that streamline front office workflows.</p>',
        topics: ['Front Office Operations'],
      },
      {
        title: 'The Art of Housekeeping Management',
        description:
          'Discover how professional housekeeping teams maintain world-class cleanliness and guest satisfaction.',
        body: '<p>Housekeeping is the backbone of hotel operations. This article dives into room cleaning protocols, laundry management, inventory control, and staff scheduling that keep hotels running smoothly.</p><p>Learn about quality assurance checks, eco-friendly cleaning practices, and how to train housekeeping staff for excellence.</p>',
        topics: ['Housekeeping'],
      },
      {
        title: 'Food & Beverage Service Best Practices',
        description:
          'Explore the standards and techniques behind exceptional food and beverage service in hospitality.',
        body: '<p>Food and beverage service is a critical component of the hospitality experience. From fine dining to banquet service, this post covers service standards, menu planning, wine pairing basics, and managing dietary requirements.</p><p>We also discuss F&B cost control, inventory management, and creating memorable dining experiences for guests.</p>',
        topics: ['Food & Beverage Service'],
      },
      {
        title: 'Building Confidence in Spoken English',
        description:
          'Practical tips and techniques to improve your spoken English fluency and confidence.',
        body: '<p>Speaking English confidently is a valuable skill in the hospitality industry. This post provides practical exercises, tongue twisters, and conversation starters to help you improve your pronunciation, fluency, and overall communication skills.</p><p>We cover common mistakes to avoid, how to think in English, and strategies for expanding your vocabulary naturally.</p>',
        topics: ['Spoken English - Basics'],
      },
      {
        title: 'Advanced English for Hospitality Professionals',
        description:
          'Elevate your professional communication with advanced English skills for the workplace.',
        body: '<p>For hospitality professionals, advanced English skills open doors to better career opportunities. This post covers professional email writing, handling guest complaints diplomatically, conducting meetings, and presenting ideas with confidence.</p><p>Learn industry-specific vocabulary, polite expressions, and effective communication strategies for the global hospitality workplace.</p>',
        topics: ['Spoken English - Advanced', 'English Grammar'],
      },
    ]

    for (const blogPost of blogPosts) {
      const post = await Post.create({
        title: blogPost.title,
        description: blogPost.description,
        body: blogPost.body,
        postType: PostTypes.BLOG,
        state: States.PUBLIC,
        publishedAt: DateTime.now().minus({ days: 15 }),
      })

      // Author link
      await db.table('author_posts').insert({
        id: cuid(),
        user_id: admin.id,
        post_id: post.id,
        created_at: now(),
        updated_at: now(),
      })

      // Topic links
      const postTaxonomies = blogPost.topics.map((topicName, idx) => ({
        id: cuid(),
        post_id: post.id,
        taxonomy_id: topicByName(topicName).id,
        sort_order: idx,
        created_at: now(),
        updated_at: now(),
      }))

      await db.table('post_taxonomies').insert(postTaxonomies)
    }

    // ------------------------------------------------------------------
    // 4. Series with video lessons (2 series × 4 lessons)
    // ------------------------------------------------------------------
    const youtubeUrls = [
      'https://www.youtube.com/watch?v=Npn-2qweD5k',
      'https://www.youtube.com/watch?v=q0I3bzYUE1A',
      'https://www.youtube.com/watch?v=zvK4-suEKnM',
      'https://www.youtube.com/watch?v=0AGHmWdnsVM',
    ]

    const seriesList = [
      {
        name: 'Hotel Management Fundamentals',
        description:
          'A comprehensive video series covering the core principles of hotel management, front office operations, housekeeping, and guest relations.',
        taxonomyName: 'Hotel Management',
        lessons: [
          {
            title: 'Introduction to Hotel Management',
            description:
              'Overview of the hotel industry, organizational structure, and key management principles.',
            body: '<p>This introductory lesson covers the structure of the hotel industry, types of hotels, departmental organization, and the role of a hotel manager. You will understand how different departments work together to create a seamless guest experience.</p>',
            taxonomyName: 'Hotel Management',
            videoIndex: 0,
          },
          {
            title: 'Front Desk Operations',
            description:
              'Learn reservation systems, check-in procedures, and guest communication at the front desk.',
            body: '<p>The front desk is the face of the hotel. This lesson covers reservation management, check-in and check-out procedures, handling special requests, and using property management systems effectively.</p>',
            taxonomyName: 'Front Office Operations',
            videoIndex: 1,
          },
          {
            title: 'Housekeeping Standards',
            description:
              'Master the standards and procedures for maintaining cleanliness and guest comfort.',
            body: '<p>Housekeeping sets the standard for guest comfort. This lesson covers room cleaning protocols, linen management, turndown service, and quality inspection procedures that ensure every guest room meets the highest standards.</p>',
            taxonomyName: 'Housekeeping',
            videoIndex: 2,
          },
          {
            title: 'Guest Relations & Communication',
            description:
              'Build skills for effective guest communication and handling complaints professionally.',
            body: '<p>Exceptional guest relations is what sets great hotels apart. This lesson covers communication techniques, handling guest complaints with empathy, upselling services, and creating memorable guest experiences that generate repeat business.</p>',
            taxonomyName: 'Hotel Management',
            videoIndex: 3,
          },
        ],
      },
      {
        name: 'Spoken English for Hospitality',
        description:
          'A practical series focused on building English communication skills specifically for hospitality professionals.',
        taxonomyName: 'Spoken English - Basics',
        lessons: [
          {
            title: 'Basic Greetings and Introductions',
            description:
              'Learn professional greetings, self-introductions, and welcoming guests in English.',
            body: '<p>First impressions matter. This lesson covers professional greetings for different times of day, introducing yourself to guests, welcoming phrases, and basic hospitality vocabulary that every front-line staff member should know.</p>',
            taxonomyName: 'Spoken English - Basics',
            videoIndex: 0,
          },
          {
            title: 'Handling Guest Queries',
            description:
              'Build confidence in answering guest questions and providing information in English.',
            body: '<p>Guests often have questions about hotel facilities, local attractions, and services. This lesson teaches you how to understand and respond to common guest queries clearly and politely in English.</p>',
            taxonomyName: 'Spoken English - Basics',
            videoIndex: 1,
          },
          {
            title: 'Telephone Etiquette',
            description:
              'Master professional telephone communication skills for the hospitality industry.',
            body: '<p>Professional phone communication is essential in hospitality. This lesson covers answering calls, taking messages, transferring calls, and handling reservation inquiries over the phone with clarity and professionalism.</p>',
            taxonomyName: 'Spoken English - Basics',
            videoIndex: 2,
          },
          {
            title: 'Handling Complaints Professionally',
            description:
              'Learn how to handle guest complaints with tact, empathy, and effective English communication.',
            body: '<p>Handling complaints is a critical skill. This lesson teaches you how to listen actively, apologize appropriately, offer solutions, and follow up with guests — all while maintaining professional English communication throughout the process.</p>',
            taxonomyName: 'Spoken English - Advanced',
            videoIndex: 3,
          },
        ],
      },
    ]

    for (const seriesItem of seriesList) {
      const series = await Series.create({
        name: seriesItem.name,
        description: seriesItem.description,
        ownerId: admin.id,
        state: States.PUBLIC,
        isFeatured: true,
      })

      // Link series to its taxonomy
      await db.table('series_taxonomies').insert({
        id: cuid(),
        series_id: series.id,
        taxonomy_id: topicByName(seriesItem.taxonomyName).id,
        sort_order: 0,
        created_at: now(),
        updated_at: now(),
      })

      // Create 4 video lessons and link them
      for (const [lessonIdx, lesson] of seriesItem.lessons.entries()) {
        const post = await Post.create({
          title: lesson.title,
          description: lesson.description,
          body: lesson.body,
          postType: PostTypes.LESSON,
          state: States.PUBLIC,
          publishedAt: DateTime.now().minus({ days: 15 }),
          videoType: VideoTypes.YOUTUBE,
          videoUrl: youtubeUrls[lesson.videoIndex % youtubeUrls.length],
        })

        // Author link
        await db.table('author_posts').insert({
          id: cuid(),
          user_id: admin.id,
          post_id: post.id,
          created_at: now(),
          updated_at: now(),
        })

        // Topic link
        await db.table('post_taxonomies').insert({
          id: cuid(),
          post_id: post.id,
          taxonomy_id: topicByName(lesson.taxonomyName).id,
          sort_order: 0,
          created_at: now(),
          updated_at: now(),
        })

        // Series–post link
        await db.table('series_posts').insert({
          id: cuid(),
          series_id: series.id,
          post_id: post.id,
          sort_order: lessonIdx,
          created_at: now(),
          updated_at: now(),
        })
      }
    }
  }
}
