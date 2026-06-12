import { Search } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

type FeedType = 'none' | 'popular' | 'noreplies' | 'unsolved' | 'solved'

type DiscussionFiltersProps = {
  q?: string
  feed?: FeedType
  onSearch: (q: string) => void
  onFeedChange: (feed: FeedType) => void
}

const feedTabs: { label: string; value: FeedType }[] = [
  { label: 'All', value: 'none' },
  { label: 'Popular', value: 'popular' },
  { label: 'No Replies', value: 'noreplies' },
  { label: 'Unsolved', value: 'unsolved' },
  { label: 'Solved', value: 'solved' },
]

export default function DiscussionFilters({
  q = '',
  feed = 'none',
  onSearch,
  onFeedChange,
}: DiscussionFiltersProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search discussions..."
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
          aria-label="Search discussions"
        />
      </div>

      {/* Feed tabs */}
      <div className="flex flex-wrap gap-2">
        {feedTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onFeedChange(tab.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              feed === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
