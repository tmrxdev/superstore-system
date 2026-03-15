'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalStock: 0,
    itemsWithDiscount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/inventory/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-bold text-foreground mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-primary/20">
          <p className="text-muted-foreground text-sm font-medium mb-2">Total Items</p>
          <p className="text-4xl font-bold text-primary">
            {loading ? '...' : stats.totalItems}
          </p>
        </Card>

        <Card className="p-6 border-primary/20">
          <p className="text-muted-foreground text-sm font-medium mb-2">Total Stock</p>
          <p className="text-4xl font-bold text-accent">
            {loading ? '...' : stats.totalStock}
          </p>
        </Card>

        <Card className="p-6 border-primary/20">
          <p className="text-muted-foreground text-sm font-medium mb-2">Discounted Items</p>
          <p className="text-4xl font-bold text-foreground">
            {loading ? '...' : stats.itemsWithDiscount}
          </p>
        </Card>
      </div>

      <div className="mt-12">
        <Card className="p-8 border-border text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Welcome to the Shop Admin Panel</h3>
          <p className="text-muted-foreground mb-6">
            Manage your Minecraft shop inventory and staff accounts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard/inventory"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium"
            >
              Go to Inventory
            </a>
            <a
              href="/"
              className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 font-medium"
            >
              View Public Shop
            </a>
          </div>
        </Card>
      </div>
    </div>
  )
}
