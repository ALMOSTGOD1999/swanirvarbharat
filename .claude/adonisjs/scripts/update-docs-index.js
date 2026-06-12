#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

const SITEMAP_URL = 'https://docs.adonisjs.com/sitemap.xml'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SKILL_ROOT = path.resolve(__dirname, '..')
const OUTPUT_PATH = path.join(SKILL_ROOT, 'docs-index.json')
const REQUEST_TIMEOUT_MS = 20_000
const MAX_ATTEMPTS = 2

async function fetchText(url, options = {}) {
  let lastError

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        headers: {
          'User-Agent': 'adonisjs-skill-docs-indexer/1.0',
          'Accept': 'text/markdown,text/plain,application/xml,text/xml,*/*',
        },
      })

      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`)
      }

      const text = await response.text()
      validateFetchedText(url, response.headers.get('content-type'), text, options)

      return text
    } catch (error) {
      lastError = error

      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 250 * attempt))
      }
    }
  }

  throw lastError
}

function validateFetchedText(url, contentType, text, options) {
  if (contentType?.includes('text/html') && /^\s*<!doctype html|^\s*<html[\s>]/i.test(text)) {
    throw new Error(`Expected text content but received HTML from ${url}`)
  }

  if (options.markdown && !hasMarkdownDocSignal(text)) {
    throw new Error('Response does not look like an AdonisJS Markdown docs page')
  }
}

function hasMarkdownDocSignal(text) {
  return /^---\s*\n[\s\S]*?\n---/m.test(text) || /^#\s+.+$/m.test(text)
}

function decodeXmlEntities(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function extractUrlsFromSitemap(xml) {
  const urls = []
  const locPattern = /<loc>\s*([^<]+?)\s*<\/loc>/g
  let match

  while ((match = locPattern.exec(xml)) !== null) {
    const url = decodeXmlEntities(match[1].trim())

    if (url.startsWith('https://docs.adonisjs.com/') && new URL(url).pathname !== '/') {
      urls.push(normalizeDocsUrl(url))
    }
  }

  return Array.from(new Set(urls)).sort((a, b) => a.localeCompare(b))
}

function normalizeDocsUrl(url) {
  return url.replace(/\/$/, '')
}

function toMarkdownUrl(url) {
  return url.endsWith('.md') ? url : `${url}.md`
}

function getPathname(url) {
  return new URL(url).pathname.replace(/^\//, '') || '/'
}

function titleFromPath(url) {
  const pathname = getPathname(url)
  const lastSegment = pathname.split('/').filter(Boolean).pop() || 'AdonisJS Documentation'

  return lastSegment.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function categoryFromUrl(url) {
  const parts = getPathname(url).split('/').filter(Boolean)

  if (parts.length === 0) return 'home'
  if (parts[0] === 'guides' && parts[1]) return parts[1]
  if (parts[0] === 'api') return 'api'
  if (parts[0] === 'cookbooks') return 'cookbooks'

  return parts[0]
}

function extractTitle(markdown, fallback) {
  const heading = markdown.match(/^#\s+(.+)$/m)
  if (heading) return heading[1].trim().replace(/\s+#+$/, '')

  const frontmatterTitle = extractFrontmatterField(markdown, 'title')
  if (frontmatterTitle) return frontmatterTitle

  const titleTag = markdown.match(/<title>(.*?)<\/title>/i)
  if (titleTag) return titleTag[1].trim()

  return fallback
}

function extractFrontmatterField(markdown, field) {
  const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!frontmatter) return null

  const pattern = new RegExp(`^${field}:\\s*(.+)$`, 'm')
  const match = frontmatter[1].match(pattern)
  if (!match) return null

  return match[1].trim().replace(/^['"]|['"]$/g, '')
}

function extractDescription(markdown) {
  const frontmatterDescription = extractFrontmatterField(markdown, 'description')
  if (frontmatterDescription) return frontmatterDescription

  const lines = markdown.split(/\r?\n/)
  let inFrontmatter = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed === '---') {
      inFrontmatter = !inFrontmatter
      continue
    }

    if (inFrontmatter || !trimmed || trimmed.startsWith('#') || trimmed.startsWith('import ')) {
      continue
    }

    return trimmed.length > 240 ? `${trimmed.slice(0, 237)}...` : trimmed
  }

  return null
}

async function buildIndex() {
  let sitemapXml

  try {
    sitemapXml = await fetchText(SITEMAP_URL)
  } catch (error) {
    throw new Error(`Unable to fetch sitemap ${SITEMAP_URL}: ${error.message}`)
  }

  const discoveredUrls = extractUrlsFromSitemap(sitemapXml)
  const pages = []
  const failed = []

  for (const url of discoveredUrls) {
    const mdUrl = toMarkdownUrl(url)

    try {
      const markdown = await fetchText(mdUrl, { markdown: true })

      pages.push({
        title: extractTitle(markdown, titleFromPath(url)),
        url,
        mdUrl,
        category: categoryFromUrl(url),
        path: getPathname(url),
        status: 'ok',
        description: extractDescription(markdown),
      })
    } catch (error) {
      failed.push({
        url,
        mdUrl,
        reason: error.message,
      })

      console.warn(`Skipping ${mdUrl}: ${error.message}`)
    }
  }

  const index = {
    name: 'adonisjs-docs-index',
    source: SITEMAP_URL,
    generatedAt: new Date().toISOString(),
    totals: {
      discovered: discoveredUrls.length,
      indexed: pages.length,
      failed: failed.length,
    },
    pages,
    failed,
  }

  const tempPath = `${OUTPUT_PATH}.tmp`
  await fs.writeFile(tempPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8')
  await fs.rename(tempPath, OUTPUT_PATH)

  return index
}

buildIndex()
  .then((index) => {
    console.log('AdonisJS docs index refreshed')
    console.log(`Source: ${index.source}`)
    console.log(`Discovered links: ${index.totals.discovered}`)
    console.log(`Indexed Markdown pages: ${index.totals.indexed}`)
    console.log(`Failed/skipped links: ${index.totals.failed}`)
    console.log(`Output: ${OUTPUT_PATH}`)
  })
  .catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
