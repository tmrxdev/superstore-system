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
      <h2 className="text-3xl font-bold text-blue-300 mb-8">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-lg p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Total Items</p>
          <p className="text-4xl font-bold text-blue-400">
            {loading ? '...' : stats.totalItems}
          </p>
        </div>

        <div className="glass-lg p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">Total Stock</p>
          <p className="text-4xl font-bold text-blue-300">
            {loading ? '...' : stats.totalStock}
          </p>
        </div>

        <div className="glass-lg p-6">
          <p className="text-slate-400 text-sm font-medium mb-2">VIP Items</p>
          <p className="text-4xl font-bold text-amber-300">
            {loading ? '...' : stats.itemsWithDiscount}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div className="glass-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-slate-100 mb-2">Welcome to Superstore Admin</h3>
          <p className="text-slate-400 mb-6">
            Manage your superstore inventory, receipts, and staff accounts
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard/inventory"
              className="px-6 py-2 glass-button-primary font-medium"
            >
              Go to Inventory
            </a>
            <a
              href="/dashboard/receipts"
              className="px-6 py-2 glass-button font-medium"
            >
              View Receipts
            </a>
            <a
              href="/"
              className="px-6 py-2 glass-button font-medium"
            >
              View Public Shop
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
