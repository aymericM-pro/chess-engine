import { Outlet } from 'react-router'
import { TopNav } from './modules/layout/components/TopNav'
import { PageBackground } from './modules/layout/components/PageBackground'

export default function App() {
  return (
    <div
      className="min-h-screen flex flex-col items-center bg-bg-1 text-text-primary overflow-x-hidden"
      style={{ paddingBottom: 40 }}
    >
      <PageBackground />
      <TopNav />
      <Outlet />
    </div>
  )
}
