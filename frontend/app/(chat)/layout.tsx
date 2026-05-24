import { ReactNode } from 'react'

export default function ChatLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar will be added in Phase 3 */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
