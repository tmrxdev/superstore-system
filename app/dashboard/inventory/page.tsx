'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import InventoryForm from '@/components/inventory-form'
import InventoryList from '@/components/inventory-list'

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/inventory')
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const handleSave = async () => {
    setShowForm(false)
    setEditingItem(null)
    fetchItems()
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' })
      fetchItems()
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  const filteredItems = items.filter(item =>
    item.item_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-blue-300">Manage Inventory</h2>
        <Button
          onClick={() => {
            setEditingItem(null)
            setShowForm(!showForm)
          }}
          className="glass-button-primary"
        >
          {showForm ? 'Close' : '+ Add Item'}
        </Button>
      </div>

      {showForm && (
        <div className="glass-lg mb-8 p-6">
          <InventoryForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false)
              setEditingItem(null)
            }}
          />
        </div>
      )}

      <div className="glass-sm mb-6 p-4">
        <Input
          type="text"
          placeholder="Search items by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
        />
      </div>

      <InventoryList
        items={filteredItems}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}
