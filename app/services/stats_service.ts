import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'
import User from '#models/user'
import Post from '#models/post'
import Series from '#models/series'
import Taxonomy from '#models/taxonomy'
import Comment from '#models/comment'
import Discussion from '#models/discussion'

export type MonthlyStat = {
  month: string
  total: number
}

export type DashboardCounts = {
  users: { total: number; monthly: MonthlyStat[] }
  posts: { total: number; monthly: MonthlyStat[] }
  series: { total: number }
  taxonomies: { total: number }
  comments: { total: number }
  discussions: { total: number; monthly: MonthlyStat[] }
  completedLessons: { total: number; monthly: MonthlyStat[] }
  watchSeconds: { total: number; monthly: MonthlyStat[] }
}

export default class StatsService {
  static async getDashboardCounts(): Promise<DashboardCounts> {
    return {
      users: {
        total: await this.getTotalUsers(),
        monthly: await this.getMonthlyUsers(),
      },
      posts: {
        total: await this.getTotalPosts(),
        monthly: await this.getMonthlyPosts(),
      },
      series: { total: await this.getTotalSeries() },
      taxonomies: { total: await this.getTotalTaxonomies() },
      comments: { total: await this.getTotalComments() },
      discussions: {
        total: await this.getTotalDiscussions(),
        monthly: await this.getMonthlyDiscussions(),
      },
      completedLessons: {
        total: await this.getCompletedLessons(),
        monthly: await this.getMonthlyCompletedLessons(),
      },
      watchSeconds: {
        total: await this.getTotalWatchSeconds(),
        monthly: await this.getMonthlyWatchSeconds(),
      },
    }
  }

  static async getTotalUsers() {
    const [result] = await User.query().count('* as total')
    return Number(result.$extras.total)
  }

  static async getMonthlyUsers(
    startDate: DateTime = DateTime.now().minus({ year: 1 }).startOf('month')
  ): Promise<MonthlyStat[]> {
    const results = await db
      .from('users')
      .select(db.raw("TO_CHAR(created_at, 'YYYY-MM') AS month"))
      .whereRaw('created_at > ?', [startDate.toSQLDate()!])
      .groupByRaw('month')
      .orderByRaw('month')

    return results.map((r: any) => ({
      month: DateTime.fromFormat(r.month, 'yyyy-MM').toFormat('MMM yyyy'),
      total: Number(r.total ?? 0),
    }))
  }

  static async getTotalPosts() {
    const [result] = await Post.query()
      .apply((scope) => scope.published())
      .count('* as total')
    return Number(result.$extras.total)
  }

  static async getMonthlyPosts(
    startDate: DateTime = DateTime.now().minus({ year: 1 }).startOf('month')
  ): Promise<MonthlyStat[]> {
    const results = await db
      .from('posts')
      .where('state', 'public')
      .where('published_at', '<=', DateTime.now().toSQL()!)
      .select(db.raw("TO_CHAR(published_at, 'YYYY-MM') AS month"))
      .whereRaw('published_at > ?', [startDate.toSQLDate()!])
      .groupByRaw('month')
      .orderByRaw('month')

    return results.map((r: any) => ({
      month: DateTime.fromFormat(r.month, 'yyyy-MM').toFormat('MMM yyyy'),
      total: Number(r.total ?? 0),
    }))
  }

  static async getTotalSeries() {
    const [result] = await Series.query().count('* as total')
    return Number(result.$extras.total)
  }

  static async getTotalTaxonomies() {
    const [result] = await Taxonomy.query().count('* as total')
    return Number(result.$extras.total)
  }

  static async getTotalComments() {
    const [result] = await Comment.query().count('* as total')
    return Number(result.$extras.total)
  }

  static async getTotalDiscussions() {
    const [result] = await Discussion.query().count('* as total')
    return Number(result.$extras.total)
  }

  static async getMonthlyDiscussions(
    startDate: DateTime = DateTime.now().minus({ year: 1 }).startOf('month')
  ): Promise<MonthlyStat[]> {
    const results = await db
      .from('discussions')
      .select(db.raw("TO_CHAR(created_at, 'YYYY-MM') AS month"))
      .whereRaw('created_at > ?', [startDate.toSQLDate()!])
      .groupByRaw('month')
      .orderByRaw('month')

    return results.map((r: any) => ({
      month: DateTime.fromFormat(r.month, 'yyyy-MM').toFormat('MMM yyyy'),
      total: Number(r.total ?? 0),
    }))
  }

  static async getCompletedLessons() {
    const [result] = await db.from('progresses').where('is_completed', true).count('* as total')
    return Number(result?.total ?? 0)
  }

  static async getMonthlyCompletedLessons(
    startDate: DateTime = DateTime.now().minus({ year: 1 }).startOf('month')
  ): Promise<MonthlyStat[]> {
    const results = await db
      .from('progresses')
      .where('is_completed', true)
      .select(db.raw("TO_CHAR(updated_at, 'YYYY-MM') AS month"))
      .whereRaw('updated_at > ?', [startDate.toSQLDate()!])
      .groupByRaw('month')
      .orderByRaw('month')

    return results.map((r: any) => ({
      month: DateTime.fromFormat(r.month, 'yyyy-MM').toFormat('MMM yyyy'),
      total: Number(r.total ?? 0),
    }))
  }

  static async getTotalWatchSeconds() {
    const [result] = await db.from('progresses').sum('watch_seconds as total')
    return Number(result?.total ?? 0)
  }

  static async getMonthlyWatchSeconds(
    startDate: DateTime = DateTime.now().minus({ year: 1 }).startOf('month')
  ): Promise<MonthlyStat[]> {
    const results = await db
      .from('progresses')
      .select(db.raw("TO_CHAR(updated_at, 'YYYY-MM') AS month"))
      .select(db.raw('SUM(watch_seconds) as total'))
      .whereRaw('updated_at > ?', [startDate.toSQLDate()!])
      .groupByRaw('month')
      .orderByRaw('month')

    return results.map((r: any) => ({
      month: DateTime.fromFormat(r.month, 'yyyy-MM').toFormat('MMM yyyy'),
      total: Number(r.total ?? 0),
    }))
  }

  static async getTotalVideoSeconds() {
    const [result] = await db.from('posts').where('state', 'public').sum('video_seconds as total')
    return Number(result?.total ?? 0)
  }
}
