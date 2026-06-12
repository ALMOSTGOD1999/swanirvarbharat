import { Head, usePage } from '@inertiajs/react'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  publishedTime?: string
  author?: string
  noindex?: boolean
}

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Swanirvarbharat'
const APP_URL =
  import.meta.env.VITE_APP_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3333')
const DEFAULT_DESCRIPTION =
  'Learn hotel management, hospitality skills, and spoken English with practical lessons, series, and blog posts from Swanirvarbharat.'
const DEFAULT_IMAGE = `${APP_URL}/og-image.svg`

export function SEOHead({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
  noindex,
}: SEOHeadProps) {
  const { url: currentPageUrl } = usePage()

  const canonicalUrl = url
    ? url.startsWith('http')
      ? url
      : `${APP_URL}${url}`
    : `${APP_URL}${currentPageUrl}`

  const ogImage = image || DEFAULT_IMAGE
  const fullTitle = title ? `${title} - ${APP_NAME}` : APP_NAME
  const metaDescription = description || DEFAULT_DESCRIPTION

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title || APP_NAME} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={`${title || APP_NAME} preview image`} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || APP_NAME} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:url" content={canonicalUrl} />
      <link rel="canonical" href={canonicalUrl} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {author && <meta property="article:author" content={author} />}
      {noindex && <meta name="robots" content="noindex" />}
    </Head>
  )
}
