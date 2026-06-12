import DashboardLayout from '~/layouts/dashboard'
import { Separator } from '~/components/ui/separator'
import { SidebarTrigger } from '~/components/ui/sidebar'
import React from 'react'

export default function Dashboard() {
  return (
    <>
      <header className="flex h-15 shrink-0 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <span className="text-sm font-medium">Dashboard</span>
      </header>
      <main className="flex flex-1 flex-col gap-4 px-2 pb-2">
        <div className="min-h-screen flex-1 border rounded-xl md:min-h-min relative">
          <svg fill="none" className="absolute inset-0 size-full stroke-pattern-stroke">
            <defs>
              <pattern
                id="pattern-d09edaee-fc6a-4f25-aca5-bf9f5f77e14a"
                width="10"
                height="10"
                x="0"
                y="0"
                patternUnits="userSpaceOnUse"
              >
                <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="url(#pattern-d09edaee-fc6a-4f25-aca5-bf9f5f77e14a)"
              stroke="none"
            ></rect>
          </svg>
        </div>
      </main>
    </>
  )
}

Dashboard.layout = (page: React.ReactElement) => <DashboardLayout>{page}</DashboardLayout>
