import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'
import Series from '#models/series'
import Taxonomy from '#models/taxonomy'

export default class SitemapController {
  async index({ response }: HttpContext) {
    const [series, topics, posts] = await Promise.all([
      Series.query()
        .whereHas('posts', (q) => q.apply((scope) => scope.published()))
        .select('slug'),
      Taxonomy.query().select('slug'),
      Post.query()
        .apply((scope) => scope.publishedPublic())
        .select('slug', 'publishedAt'),
    ])

    let urls = `  <url>
    <loc>https://swanirvarbharat.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`

    for (const s of series) {
      urls += `
  <url>
    <loc>https://swanirvarbharat.com/series/${s.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    }

    for (const t of topics) {
      urls += `
  <url>
    <loc>https://swanirvarbharat.com/topics/${t.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
    }

    for (const post of posts) {
      const lastmod = post.publishedAt?.toISO() ?? ''
      urls += `
  <url>
    <loc>https://swanirvarbharat.com/posts/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    response.header('Content-Type', 'application/xml')
    return response.send(xml)
  }
}
