'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem('shopSession')
    if (!session) {
      router.push('/auth/login')
      return
    }

    const userData = JSON.parse(session)
    setUser(userData)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('shopSession')
    router.push('/auth/login')
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">⛏️ Minecraft Shop</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <p className="text-foreground font-medium">{user?.email}</p>
              <p className="text-muted-foreground">{user?.role}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-border hover:bg-muted"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4">
          <NavLink href="/dashboard" active={pathname === '/dashboard'}>
            Dashboard
          </NavLink>
          {user?.role === 'superadmin' && (
            <NavLink href="/dashboard/users" active={pathname === '/dashboard/users'}>
              Manage Users
            </NavLink>
          )}
          <NavLink href="/dashboard/inventory" active={pathname === '/dashboard/inventory'}>
            Manage Inventory
          </NavLink>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className={`px-4 py-3 border-b-2 font-medium transition ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </a>
  )
}
