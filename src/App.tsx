import { Outlet, useLocation } from 'react-router'
import { TopNav } from './modules/layout/components/TopNav'
import { PageBackground } from './modules/layout/components/PageBackground'
import { MainSidebar } from './modules/layout/components/MainSidebar'
import { GameInviteSocket } from './modules/gameInvites/components/GameInviteSocket'
import { SidebarProvider } from '@/shared/components/Sidebar'

export default function App() {
  const location = useLocation()
  const showSidebar = location.pathname !== '/'

  return (
    <SidebarProvider>
      <div
        className="min-h-screen flex flex-col overflow-x-hidden"
        style={{ background: 'var(--color-bg-1)', color: 'var(--color-text-primary)', transition: 'background 0.2s, color 0.2s' }}
      >
        <PageBackground />
        <GameInviteSocket />
        <TopNav />
        <div className="flex min-h-[calc(100vh-64px)] w-full flex-1 flex-col lg:flex-row">
          {showSidebar && <MainSidebar />}
          <main className="flex w-full min-w-0 flex-1 flex-col">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
