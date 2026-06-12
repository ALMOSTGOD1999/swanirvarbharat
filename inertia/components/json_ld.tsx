type JsonLdProps = {
  type: 'Article' | 'WebSite' | 'Organization' | 'BreadcrumbList' | 'Course'
  data: Record<string, any>
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function ArticleJsonLd({
  title,
  description,
  image,
  url,
  publishedTime,
  author,
}: {
  title: string
  description?: string
  image?: string
  url: string
  publishedTime?: string
  author?: string
}) {
  return (
    <JsonLd
      type="Article"
      data={{
        headline: title,
        description,
        image,
        url,
        datePublished: publishedTime,
        author: author ? { '@type': 'Person', 'name': author } : undefined,
        publisher: {
          '@type': 'Organization',
          'name': 'Swanirvarbharat',
          'logo': { '@type': 'ImageObject', 'url': `${getAppUrl()}/logo.png` },
        },
      }}
    />
  )
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      type="WebSite"
      data={{
        name: 'Swanirvarbharat',
        url: getAppUrl(),
        potentialAction: {
          '@type': 'SearchAction',
          'target': `${getAppUrl()}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      type="BreadcrumbList"
      data={{
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': item.name,
          'item': item.url,
        })),
      }}
    />
  )
}

function getAppUrl() {
  if (typeof window !== 'undefined') return window.location.origin
  return import.meta.env.VITE_APP_URL || 'https://swanirvarbharat.com'
}
