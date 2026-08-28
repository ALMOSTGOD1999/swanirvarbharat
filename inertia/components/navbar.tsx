import { useEffect, useRef, useState } from 'react'
import type { Data } from '@generated/data'
import { usePage } from '@inertiajs/react'
import { Link, Form } from '@adonisjs/inertia/react'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, SearchIcon } from 'lucide-react'
import { cn } from '~/lib/utils'
import { urlFor } from '~/client'
import { Logo } from '~/components/logo'

const navLinks = [
  { label: 'Home', route: 'home' },
  { label: 'Lessons', route: 'lessons.index' },
  { label: 'Courses', route: 'series.index' },
  { label: 'Topics', route: 'topics.index' },
  { label: 'News', route: 'blogs.index' },
  { label: 'Forum', route: 'discussions.index' },
] as const

export function Navbar() {
  const { url } = usePage()
  const { user } = usePage<Data.SharedProps>().props
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const currentUrl = useRef(url)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (currentUrl.current !== url) {
      currentUrl.current = url
      setMobileOpen(false)
    }
  }, [url])

  return (
    <>
      <nav
        className={cn(
          'fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300',
          scrolled ? 'top-3' : 'top-4'
        )}
      >
        <div
          className={cn(
            'flex w-full max-w-5xl items-center justify-between rounded-full border px-4 py-2 transition-all duration-300',
            scrolled
              ? 'border-border bg-card/80 backdrop-blur-xl shadow-lg'
              : 'border-transparent bg-transparent'
          )}
        >
          <div className="shrink-0">
            <Logo width={160} height={26} />
          </div>

          {/* Desktop Nav Pills */}
          <div
            className={cn(
              'hidden md:flex items-center rounded-full border p-1 transition-all duration-300',
              scrolled ? 'border-border bg-muted/40' : 'border-white/10 bg-white/5'
            )}
          >
            <div className="relative flex items-center">
              {navLinks.map((link) => {
                const href = urlFor(link.route)
                const isActive = url === href || url.startsWith(`${href}/`)
                return (
                  <Link
                    key={link.route}
                    route={link.route}
                    className={cn(
                      'relative z-10 px-4 py-1.5 text-sm font-medium transition-colors rounded-full',
                      isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/15"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
              <Link
                href={urlFor('search')}
                className={cn(
                  'relative z-10 px-3 py-1.5 text-sm font-medium transition-colors rounded-full',
                  url === urlFor('search') || url.startsWith(`${urlFor('search')}/`)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-label="Search"
              >
                <SearchIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link
                  route="dashboard"
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  route="users.watchlist"
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Watchlist
                </Link>
                <Form route="session.destroy">
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Logout
                  </button>
                </Form>
              </>
            ) : (
              <>
                <Link
                  route="session.create"
                  className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  route="new_account.create"
                  className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed top-18 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border md:hidden overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const href = urlFor(link.route)
                const isActive = url === href || url.startsWith(`${href}/`)
                return (
                  <Link
                    key={link.route}
                    route={link.route}
                    className={cn(
                      'px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      isActive
                        ? 'bg-white/15 text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}

              <Link
                href={urlFor('search')}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  url === urlFor('search') || url.startsWith(`${urlFor('search')}/`)
                    ? 'bg-white/15 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                )}
              >
                <span className="flex items-center gap-2">
                  <SearchIcon className="h-4 w-4" />
                  Search
                </span>
              </Link>

              <div className="mt-2 pt-3 border-t border-border flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      route="dashboard"
                      className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      route="users.watchlist"
                      className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                      Watchlist
                    </Link>
                    <Form route="session.destroy">
                      <button
                        type="submit"
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                      >
                        Logout
                      </button>
                    </Form>
                  </>
                ) : (
                  <>
                    <Link
                      route="session.create"
                      className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors text-center"
                    >
                      Login
                    </Link>
                    <Link
                      route="new_account.create"
                      className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
