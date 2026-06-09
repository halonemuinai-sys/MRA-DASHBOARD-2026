import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useApp } from '../../context/AppContext'

export default function Layout({ children, title }) {
  const { isSidebarCollapsed } = useApp()

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <div className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        <footer className="text-center text-xs text-slate-400 py-2.5 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-colors duration-300">
          &copy; 2026 PT Mugi Rekso Abadi (Group). All rights reserved.
        </footer>
      </div>
    </div>
  )
}
