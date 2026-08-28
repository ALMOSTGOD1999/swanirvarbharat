import { Link } from '@adonisjs/inertia/react'

import { motion, type Variants } from 'motion/react'
import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Code,
  Flame,
  Newspaper,
  Percent,
  PlayCircle,
  Sparkles,
  StickyNote,
  Users,
  Award,
} from 'lucide-react'
import type React from 'react'

import { Badge } from '~/components/ui/badge'
import { buttonVariants } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardPanel, CardTitle } from '~/components/ui/card'
import { WebsiteJsonLd } from '~/components/json_ld'
import DefaultLayout from '~/layouts/default'
import ScrollReveal from '~/components/scroll_reveal'
import WelcomeAnimation from '~/components/welcome_animation'
import { SEOHead } from '~/components/seo_head'
import { cn } from '~/lib/utils'
import type { InertiaProps } from '~/types'
import type { Data } from '@generated/data'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FeaturedSeries = Data.Series
type LatestPost = Data.Post
type Topic = Data.Taxonomy

type PageProps = InertiaProps<{
  featuredSeries: FeaturedSeries[]
  latestPosts: LatestPost[]
  topics: Topic[]
  stats: { posts: number; series: number; topics: number }
}>

// ---------------------------------------------------------------------------
// Advisors
// ---------------------------------------------------------------------------

const advisors = [
  {
    name: 'Rajesh Kumar',
    role: 'Hospitality Industry Advisor',
    details:
      'Former General Manager at Taj Hotels with over 25 years of experience in luxury hospitality. Guides curriculum development and industry partnerships.',
  },
  {
    name: 'Priya Sharma',
    role: 'Education & Training Advisor',
    details:
      'Dean of Hospitality Studies with 20 years in vocational education. Oversees pedagogy, assessment frameworks, and student mentorship programs.',
  },
  {
    name: 'Anil Mehta',
    role: 'Rural Development Advisor',
    details:
      'Social entrepreneur and NGO leader working in rural skill development for 15 years. Advises on community outreach and grassroots mobilization.',
  },
] as const

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const heroText: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDuration(seconds: number) {
  if (!seconds) return '0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function stripHtml(input?: string | null) {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function excerpt(post: LatestPost) {
  const source = post.description || stripHtml(post.description)
  if (!source) return 'Read the full post to explore the details.'
  if (source.length <= 140) return source
  return `${source.slice(0, 137).trim()}…`
}

function postTypeIcon(postType: string) {
  switch (postType) {
    case 'lesson':
      return <BookOpen className="size-4" aria-hidden="true" />
    case 'blog':
      return <Newspaper className="size-4" aria-hidden="true" />
    case 'snippet':
      return <StickyNote className="size-4" aria-hidden="true" />
    case 'livestream':
      return <PlayCircle className="size-4" aria-hidden="true" />
    case 'link':
      return <Code className="size-4" aria-hidden="true" />
    default:
      return <Sparkles className="size-4" aria-hidden="true" />
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function Home({
  featuredSeries = [],
  latestPosts = [],
  topics = [],
  stats = { posts: 0, series: 0, topics: 0 },
}: PageProps) {
  return (
    <>
      <SEOHead
        title="Learn New Skills"
        description="Free video lessons, blog posts, and learning resources. Explore hotel management, hospitality, and spoken English courses."
        type="website"
      />
      <WebsiteJsonLd />
      <WelcomeAnimation />

      <div className="min-h-screen">
        {/* ── Hero ─────────────────────────────────────────────── */}
        <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-secondary/10" />

          {/* Decorative elements */}
          <div className="absolute -left-20 -top-20 size-96 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -right-20 top-60 size-80 rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute bottom-40 left-1/3 size-64 rounded-full bg-warm/10 blur-3xl" />

          <div className="relative z-10 mx-auto max-w-6xl px-5">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: Text Content */}
              <div className="text-center lg:text-left">
                <motion.div variants={heroText} initial="hidden" animate="visible" custom={0}>
                  <span className="mb-6 inline-block rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary backdrop-blur-sm">
                    Star Campus Placement
                  </span>
                </motion.div>

                <motion.h1
                  className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
                  variants={heroText}
                  initial="hidden"
                  animate="visible"
                  custom={0.2}
                >
                  Hotel Management
                  <span className="block mt-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    &amp; Spoken English
                  </span>
                </motion.h1>

                <motion.p
                  className="mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
                  variants={heroText}
                  initial="hidden"
                  animate="visible"
                  custom={0.5}
                >
                  Industry-focused training with guaranteed placement support in top hotel chains.
                  Learn from experts and launch your hospitality career.
                </motion.p>

                <motion.div
                  className="flex flex-col gap-4 sm:flex-row"
                  variants={heroText}
                  initial="hidden"
                  animate="visible"
                  custom={0.8}
                >
                  <Link
                    href="/series"
                    className={cn(buttonVariants({ size: 'lg' }), 'gap-2 px-8 text-base')}
                  >
                    Start Learning <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/signup"
                    className={cn(
                      buttonVariants({ size: 'lg', variant: 'secondary' }),
                      'px-8 text-base'
                    )}
                  >
                    Enroll Now
                  </Link>
                </motion.div>
              </div>
              <div className="hidden lg:block">
                <motion.div
                  className="rounded-2xl border bg-card p-8 shadow-lg"
                  variants={heroText}
                  initial="hidden"
                  animate="visible"
                  custom={0.3}
                >
                  {/* Hero Illustration */}
                  <div className="mb-6 flex justify-center">
                    <svg
                      viewBox="0 0 400 200"
                      className="w-full max-w-sm"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background glow */}
                      <circle cx="200" cy="100" r="90" fill="url(#heroGlow)" />
                      <defs>
                        <radialGradient id="heroGlow">
                          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      {/* Hotel Building */}
                      <rect
                        x="155"
                        y="60"
                        width="90"
                        height="110"
                        rx="6"
                        fill="#38BDF8"
                        opacity="0.2"
                      />
                      <rect
                        x="155"
                        y="60"
                        width="90"
                        height="110"
                        rx="6"
                        stroke="#38BDF8"
                        strokeWidth="1.5"
                        opacity="0.6"
                      />
                      {/* Hotel roof */}
                      <rect
                        x="148"
                        y="52"
                        width="104"
                        height="10"
                        rx="3"
                        fill="#38BDF8"
                        opacity="0.4"
                      />
                      {/* Building stripe */}
                      <rect x="155" y="95" width="90" height="3" fill="#38BDF8" opacity="0.3" />
                      <rect x="155" y="130" width="90" height="3" fill="#38BDF8" opacity="0.3" />
                      {/* Windows row 1 */}
                      <rect
                        x="170"
                        y="68"
                        width="12"
                        height="18"
                        rx="2"
                        fill="#38BDF8"
                        opacity="0.7"
                      />
                      <rect
                        x="190"
                        y="68"
                        width="12"
                        height="18"
                        rx="2"
                        fill="#22C55E"
                        opacity="0.6"
                      />
                      <rect
                        x="210"
                        y="68"
                        width="12"
                        height="18"
                        rx="2"
                        fill="#F97316"
                        opacity="0.7"
                      />
                      {/* Windows row 2 */}
                      <rect
                        x="170"
                        y="102"
                        width="12"
                        height="18"
                        rx="2"
                        fill="#F97316"
                        opacity="0.7"
                      />
                      <rect
                        x="190"
                        y="102"
                        width="12"
                        height="18"
                        rx="2"
                        fill="#38BDF8"
                        opacity="0.7"
                      />
                      <rect
                        x="210"
                        y="102"
                        width="12"
                        height="18"
                        rx="2"
                        fill="#22C55E"
                        opacity="0.6"
                      />
                      {/* Windows row 3 */}
                      <rect
                        x="170"
                        y="138"
                        width="12"
                        height="18"
                        rx="2"
                        fill="#22C55E"
                        opacity="0.6"
                      />
                      <rect
                        x="210"
                        y="138"
                        width="12"
                        height="18"
                        rx="2"
                        fill="#38BDF8"
                        opacity="0.7"
                      />
                      {/* Door */}
                      <rect
                        x="190"
                        y="142"
                        width="20"
                        height="28"
                        rx="3"
                        fill="#38BDF8"
                        opacity="0.5"
                      />
                      {/* Star icon on building */}
                      <text
                        x="200"
                        y="90"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#F97316"
                        opacity="0.8"
                      >
                        ★
                      </text>
                      {/* Left pillar */}
                      <rect
                        x="130"
                        y="95"
                        width="18"
                        height="75"
                        rx="3"
                        fill="#22C55E"
                        fillOpacity="0.15"
                        stroke="#22C55E"
                        strokeWidth="1"
                        strokeOpacity="0.4"
                      />
                      <rect
                        x="130"
                        y="88"
                        width="18"
                        height="10"
                        rx="3"
                        fill="#22C55E"
                        opacity="0.3"
                      />
                      {/* Right pillar */}
                      <rect
                        x="252"
                        y="95"
                        width="18"
                        height="75"
                        rx="3"
                        fill="#F97316"
                        fillOpacity="0.15"
                        stroke="#F97316"
                        strokeWidth="1"
                        strokeOpacity="0.4"
                      />
                      <rect
                        x="252"
                        y="88"
                        width="18"
                        height="10"
                        rx="3"
                        fill="#F97316"
                        opacity="0.3"
                      />
                      {/* Graduation cap */}
                      <g transform="translate(115, 25)">
                        <path d="M8 12 L30 4 L52 12 L30 20 Z" fill="#F97316" opacity="0.8" />
                        <rect
                          x="27"
                          y="20"
                          width="6"
                          height="10"
                          rx="2"
                          fill="#F97316"
                          opacity="0.8"
                        />
                        <line
                          x1="18"
                          y1="16"
                          x2="18"
                          y2="28"
                          stroke="#F97316"
                          strokeWidth="2"
                          opacity="0.5"
                          strokeDasharray="2 2"
                        />
                        <line
                          x1="42"
                          y1="16"
                          x2="42"
                          y2="28"
                          stroke="#22C55E"
                          strokeWidth="2"
                          opacity="0.5"
                          strokeDasharray="2 2"
                        />
                      </g>
                      {/* Globe */}
                      <g transform="translate(275, 30)">
                        <circle
                          cx="15"
                          cy="15"
                          r="14"
                          fill="none"
                          stroke="#22C55E"
                          strokeWidth="1.5"
                          opacity="0.6"
                        />
                        <ellipse
                          cx="15"
                          cy="15"
                          rx="8"
                          ry="14"
                          fill="none"
                          stroke="#22C55E"
                          strokeWidth="0.8"
                          opacity="0.4"
                        />
                        <line
                          x1="1"
                          y1="15"
                          x2="29"
                          y2="15"
                          stroke="#22C55E"
                          strokeWidth="0.8"
                          opacity="0.4"
                        />
                        <path
                          d="M8 5 Q15 12 22 5"
                          fill="none"
                          stroke="#22C55E"
                          strokeWidth="0.8"
                          opacity="0.4"
                        />
                        <path
                          d="M8 25 Q15 18 22 25"
                          fill="none"
                          stroke="#22C55E"
                          strokeWidth="0.8"
                          opacity="0.4"
                        />
                      </g>
                      {/* Speech bubbles for Spoken English */}
                      <g transform="translate(65, 120)">
                        <rect
                          x="0"
                          y="0"
                          width="45"
                          height="28"
                          rx="14"
                          fill="#38BDF8"
                          opacity="0.15"
                        />
                        <text
                          x="22"
                          y="19"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#38BDF8"
                          opacity="0.8"
                        >
                          Hello
                        </text>
                      </g>
                      <g transform="translate(290, 140)">
                        <rect
                          x="0"
                          y="0"
                          width="45"
                          height="28"
                          rx="14"
                          fill="#22C55E"
                          opacity="0.15"
                        />
                        <text
                          x="22"
                          y="19"
                          textAnchor="middle"
                          fontSize="12"
                          fill="#22C55E"
                          opacity="0.8"
                        >
                          Welcome
                        </text>
                      </g>
                      {/* Small decorative dots */}
                      <circle cx="60" cy="45" r="3" fill="#38BDF8" opacity="0.4" />
                      <circle cx="340" cy="55" r="2" fill="#F97316" opacity="0.4" />
                      <circle cx="80" cy="75" r="2" fill="#22C55E" opacity="0.3" />
                      <circle cx="320" cy="80" r="3" fill="#38BDF8" opacity="0.3" />
                      <circle cx="340" cy="170" r="2" fill="#F97316" opacity="0.4" />
                      <circle cx="55" cy="165" r="2" fill="#22C55E" opacity="0.3" />
                    </svg>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-primary/5 p-4 text-center">
                      <p className="text-3xl font-bold text-primary">500+</p>
                      <p className="text-sm text-muted-foreground">Students Placed</p>
                    </div>
                    <div className="rounded-xl bg-secondary/5 p-4 text-center">
                      <p className="text-3xl font-bold text-secondary">50+</p>
                      <p className="text-sm text-muted-foreground">Partner Hotels</p>
                    </div>
                    <div className="rounded-xl bg-warm/5 p-4 text-center">
                      <p className="text-3xl font-bold text-warm-600">92%</p>
                      <p className="text-sm text-muted-foreground">Placement Rate</p>
                    </div>
                    <div className="rounded-xl bg-primary/5 p-4 text-center">
                      <p className="text-3xl font-bold text-primary">5L</p>
                      <p className="text-sm text-muted-foreground">Avg Salary</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-center text-sm font-medium text-muted-foreground">
                      Placement in top hotels
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Scroll nudge */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <div className="flex size-6 items-start justify-center rounded-full border-2 border-foreground/20 pt-1.5">
              <div className="size-1 rounded-full bg-foreground/40" />
            </div>
          </motion.div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {[
                { icon: BookOpen, value: stats.posts, label: 'Posts Published' },
                { icon: Flame, value: stats.series, label: 'Courses' },
                { icon: Users, value: stats.topics, label: 'Topics Covered' },
                { icon: Percent, value: '58%', label: 'Female Student Percentage' },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.15}>
                  <div className="rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                      <stat.icon className="text-primary" size={24} />
                    </div>
                    <div className="text-4xl font-bold tracking-tight text-foreground">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── How to Get Started ─────────────────────────── */}
        <section className="border-t bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-5">
            <ScrollReveal>
              <h2 className="mb-10 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                How to Get Started & Free Job Placement
              </h2>
            </ScrollReveal>

            <div className="grid gap-8 md:grid-cols-3">
              {/* English */}
              <ScrollReveal>
                <h3 className="mb-4 text-lg font-semibold text-primary">English</h3>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      1
                    </span>
                    <div>
                      <strong>Sign Up</strong> — Create your account using your email and a
                      password. Verify your email address through the link we send you.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      2
                    </span>
                    <div>
                      <strong>Complete Profile</strong> — Fill in your personal details, upload your
                      educational documents (10th, 12th certificates, etc.), and record a short
                      introduction video.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      3
                    </span>
                    <div>
                      <strong>Submit for Review</strong> — Once your profile is complete, submit
                      your application for admin review. An admin will verify your documents and
                      KYC.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      4
                    </span>
                    <div>
                      <strong>Get Approved</strong> — After approval, you get full access to all
                      lessons, series, and assessments.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-600">
                      <Check className="size-3.5" />
                    </span>
                    <div>
                      <strong>✅ Free Job Placement in Bengal</strong> — Approved candidates receive
                      free job placement assistance in leading hotels across Bengal. Our placement
                      partners include Taj, Marriott, Hyatt, Oberoi, and more.
                    </div>
                  </li>
                </ol>
              </ScrollReveal>

              {/* Hindi */}
              <ScrollReveal>
                <h3 className="mb-4 text-lg font-semibold text-secondary">हिन्दी</h3>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      १
                    </span>
                    <div>
                      <strong>साइन अप करें</strong> — अपने ईमेल और पासवर्ड से खाता बनाएं। हमारे
                      द्वारा भेजे गए लिंक से अपना ईमेल सत्यापित करें।
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      २
                    </span>
                    <div>
                      <strong>प्रोफाइल पूरा करें</strong> — अपनी व्यक्तिगत जानकारी भरें, शैक्षिक
                      दस्तावेज (10वीं, 12वीं प्रमाणपत्र आदि) अपलोड करें, और एक छोटा परिचय वीडियो
                      रिकॉर्ड करें।
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      ३
                    </span>
                    <div>
                      <strong>समीक्षा के लिए जमा करें</strong> — प्रोफाइल पूरा होने पर, एडमिन
                      समीक्षा के लिए अपना आवेदन जमा करें। एडमिन आपके दस्तावेजों और KYC को सत्यापित
                      करेगा।
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      ४
                    </span>
                    <div>
                      <strong>स्वीकृति प्राप्त करें</strong> — स्वीकृति के बाद, आपको सभी पाठों,
                      श्रृंखलाओं और मूल्यांकनों तक पूर्ण पहुंच मिल जाती है।
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-600">
                      <Check className="size-3.5" />
                    </span>
                    <div>
                      <strong>✅ बंगाल में मुफ्त नौकरी प्लेसमेंट</strong> — स्वीकृत उम्मीदवारों को
                      बंगाल के प्रमुख होटलों में मुफ्त नौकरी प्लेसमेंट सहायता प्रदान की जाती है।
                      हमारे प्लेसमेंट पार्टनर्स में ताज, मैरियट, हयात, ओबेरॉय और अन्य शामिल हैं।
                    </div>
                  </li>
                </ol>
              </ScrollReveal>

              {/* Bengali */}
              <ScrollReveal>
                <h3 className="mb-4 text-lg font-semibold text-warm-600">বাংলা</h3>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      ১
                    </span>
                    <div>
                      <strong>সাইন আপ করুন</strong> — আপনার ইমেল এবং পাসওয়ার্ড দিয়ে একটি
                      অ্যাকাউন্ট তৈরি করুন। আমরা পাঠানো লিঙ্কের মাধ্যমে আপনার ইমেল যাচাই করুন।
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      ২
                    </span>
                    <div>
                      <strong>প্রোফাইল সম্পূর্ণ করুন</strong> — আপনার ব্যক্তিগত বিবরণ পূরণ করুন,
                      আপনার শিক্ষাগত নথি (দশম, দ্বাদশ সার্টিফিকেট ইত্যাদি) আপলোড করুন এবং একটি
                      সংক্ষিপ্ত পরিচয় ভিডিও রেকর্ড করুন।
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      ৩
                    </span>
                    <div>
                      <strong>পর্যালোচনার জন্য জমা দিন</strong> — আপনার প্রোফাইল সম্পূর্ণ হলে,
                      অ্যাডমিন পর্যালোচনার জন্য আপনার আবেদন জমা দিন। অ্যাডমিন আপনার নথি এবং KYC
                      যাচাই করবে।
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      ৪
                    </span>
                    <div>
                      <strong>অনুমোদন পান</strong> — অনুমোদনের পরে, আপনি সমস্ত পাঠ, সিরিজ এবং
                      মূল্যায়নে সম্পূর্ণ অ্যাক্সেস পাবেন।
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500/15 text-green-600">
                      <Check className="size-3.5" />
                    </span>
                    <div>
                      <strong>✅ বাংলায় বিনামূল্যে চাকরি প্লেসমেন্ট</strong> — অনুমোদিত প্রার্থীরা
                      বাংলার শীর্ষ হোটেলগুলিতে বিনামূল্যে চাকরি প্লেসমেন্ট সহায়তা পান। আমাদের
                      প্লেসমেন্ট অংশীদারদের মধ্যে তাজ, ম্যারিয়ট, হায়াত, ওবেরয় এবং আরও অনেকেই
                      রয়েছেন।
                    </div>
                  </li>
                </ol>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Featured Series ──────────────────────────────────── */}
        {featuredSeries.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-5">
              <ScrollReveal>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Featured Courses
                  </h2>
                  <p className="mt-3 text-muted-foreground">
                    Structured courses to build real-world skills
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {featuredSeries.map((series, i) => (
                  <ScrollReveal key={series.id} delay={i * 0.1}>
                    <Link href={`/series/${series.slug}`} className="block h-full">
                      <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
                        <CardHeader className="gap-3">
                          <CardTitle className="text-lg leading-tight">{series.name}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {series.description || 'A structured learning course'}
                          </CardDescription>
                        </CardHeader>
                        <CardPanel className="pt-0">
                          <div className="flex items-center gap-4 border-t pt-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="size-3.5" />
                              {series.postsCount ?? 0} posts
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="size-3.5" />
                              {formatDuration(series.videoSecondsSum ?? 0)}
                            </span>
                          </div>
                        </CardPanel>
                      </Card>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal>
                <div className="mt-8 text-center">
                  <Link
                    href="/series"
                    className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
                  >
                    View all courses <ArrowRight className="size-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── Latest Posts ─────────────────────────────────────── */}
        {latestPosts.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-5">
              <ScrollReveal>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest Posts</h2>
                  <p className="mt-3 text-muted-foreground">
                    Fresh articles, guides, and resources
                  </p>
                </div>
              </ScrollReveal>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {latestPosts.map((post, i) => (
                  <ScrollReveal key={post.id} delay={i * 0.08}>
                    <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
                      <div className="border-b bg-muted/30">
                        {post.thumbnail?.url ? (
                          <img
                            src={post.thumbnail.url}
                            alt={post.thumbnail.altText || post.title}
                            className="aspect-video w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex aspect-video items-center justify-center text-muted-foreground">
                            {postTypeIcon(post.postType)}
                          </div>
                        )}
                      </div>
                      <CardHeader className="gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{post.postType}</Badge>
                          {post.publishedAtDisplay && (
                            <span className="text-xs text-muted-foreground">
                              {post.publishedAtDisplay}
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          <Link
                            href={`/posts/${post.slug}`}
                            className="transition-colors hover:text-primary"
                          >
                            {post.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{excerpt(post)}</CardDescription>
                      </CardHeader>
                      <CardPanel className="pt-0">
                        <div className="flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                          <span>{post.authors?.[0]?.username || 'Swanirvarbharat'}</span>
                          {post.readMinutesDisplay && (
                            <span className="flex items-center gap-1">
                              <Clock className="size-3" />
                              {post.readMinutesDisplay} min
                            </span>
                          )}
                        </div>
                      </CardPanel>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal>
                <div className="mt-8 text-center">
                  <Link
                    href="/posts"
                    className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
                  >
                    View all posts <ArrowRight className="size-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── Topics ───────────────────────────────────────────── */}
        {topics.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="container mx-auto px-5">
              <ScrollReveal>
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Explore Topics</h2>
                  <p className="mt-3 text-muted-foreground">
                    Dive into specific areas of knowledge
                  </p>
                </div>
              </ScrollReveal>

              <div className="flex flex-wrap justify-center gap-3">
                {topics.map((topic, i) => (
                  <ScrollReveal key={topic.id} delay={i * 0.05}>
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="group flex items-center gap-2 rounded-full border bg-card px-5 py-2.5 text-sm font-medium transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                    >
                      {topic.name}
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground transition-colors group-hover:bg-primary-foreground/20 group-hover:text-primary-foreground">
                        {topic.postsCount ?? 0}
                      </span>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>

              <ScrollReveal>
                <div className="mt-8 text-center">
                  <Link
                    href="/topics"
                    className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
                  >
                    All topics <ArrowRight className="size-4" />
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── Our Advisors ──────────────────────────────────────── */}
        <section className="border-t bg-muted/30 py-16 md:py-20">
          <div className="container mx-auto px-5">
            <ScrollReveal>
              <div className="mb-10 text-center">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                  <Award className="text-primary" size={24} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Advisors</h2>
                <p className="mt-3 text-muted-foreground">
                  Experienced leaders guiding our mission to empower rural youth
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {advisors.map((advisor, i) => (
                <ScrollReveal key={advisor.name} delay={i * 0.1}>
                  <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
                    <CardPanel className="p-6 text-center">
                      <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                        {advisor.name.charAt(0)}
                      </div>
                      <CardTitle className="text-lg">{advisor.name}</CardTitle>
                      <p className="mt-1 text-sm font-medium text-primary">{advisor.role}</p>
                      <CardDescription className="mt-3 text-sm leading-relaxed">
                        {advisor.details}
                      </CardDescription>
                    </CardPanel>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="relative overflow-hidden py-16 md:py-20">
          <div className="absolute inset-0 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10" />
          <div className="absolute left-0 top-0 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10" />
          <div className="absolute bottom-0 right-0 size-80 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/5" />

          <div className="container relative z-10 mx-auto px-5 text-center">
            <ScrollReveal>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Start Learning?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Join the community and start learning something new today.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/series" className={cn(buttonVariants({ size: 'lg' }), 'gap-2 px-8')}>
                  Browse Courses <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/forum"
                  className={cn(buttonVariants({ size: 'lg', variant: 'outline' }), 'px-8')}
                >
                  Join the Forum
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  )
}

Home.layout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>
