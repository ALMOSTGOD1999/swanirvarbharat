import type { HttpContext } from '@adonisjs/core/http'

import Post from '#models/post'

export default class RssController {
  async index({ response }: HttpContext) {
    const posts = await Post.query()
      .apply((scope) => scope.publishedPublic())
      .orderBy('publishedAt', 'desc')
      .limit(25)

    let items = ''
    for (const post of posts) {
      const pubDate = post.publishedAt?.toRFC2822() ?? post.createdAt?.toRFC2822() ?? ''
      items += `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://swanirvarbharat.com/posts/${post.slug}</link>
      <guid>https://swanirvarbharat.com/posts/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.description ?? ''}]]></description>
      <content:encoded><![CDATA[${post.body ?? ''}]]></content:encoded>
    </item>`
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Swanirvarbharat</title>
    <link>https://swanirvarbharat.com</link>
    <description>Free learning resources on a wide range of topics</description>
    <atom:link href="https://swanirvarbharat.com/rss" rel="self" type="application/rss+xml"/>${items}
  </channel>
</rss>`

    response.header('Content-Type', 'text/xml')
    return response.send(xml)
  }
}
