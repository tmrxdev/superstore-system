'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface InventoryListProps {
  items: any[]
  loading: boolean
  onEdit: (item: any) => void
  onDelete: (id: string) => void
}

export default function InventoryList({
  items,
  loading,
  onEdit,
  onDelete,
}: InventoryListProps) {
  if (loading) {
    return <p className="text-slate-400">Loading inventory...</p>
  }

  if (items.length === 0) {
    return (
      <div className="glass-lg p-12 text-center">
        <p className="text-slate-300 mb-4">No items in inventory yet</p>
        <p className="text-sm text-slate-400">
          Click "Add Item" to create your first inventory item
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="glass-lg p-6 hover:border-blue-400/50 transition group">
          {item.image_url && (
            <div className="mb-4 bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-center h-40">
              <img
                src={item.image_url}
                alt={item.item_name}
                className="h-32 w-32 object-contain group-hover:scale-110 transition rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}

          <h3 className="text-lg font-semibold text-slate-100 mb-2">{item.item_name}</h3>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">ID:</span>
              <span className="font-mono text-slate-300">{item.item_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Price:</span>
              <span className="text-blue-400 font-semibold">${item.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Stock:</span>
              <span className={item.stock > 0 ? 'text-slate-300' : 'text-red-400'}>
                {item.stock} {item.stock === 0 && '(Out of stock)'}
              </span>
            </div>

            {item.vip_only && (
              <div className="flex justify-between">
                <span className="text-slate-400">VIP Only:</span>
                <span className="text-amber-400 font-semibold">Yes</span>
              </div>
            )}

            {item.vip_discount_percentage && (
              <div className="flex justify-between">
                <span className="text-slate-400">VIP Discount:</span>
                <span className="text-amber-300">{item.vip_discount_percentage}%</span>
              </div>
            )}

            {item.eligible_for_auto_discount && (
              <div className="flex justify-between">
                <span className="text-slate-400">Daily Deal:</span>
                <span className="text-blue-400">{item.discount_percentage}%</span>
              </div>
            )}

            {(item.eligible_for_auto_discount || item.vip_only) && (
              <div className="pt-2 flex flex-wrap gap-2">
                {item.eligible_for_auto_discount && (
                  <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-300 text-xs font-medium rounded">
                    Daily Deal
                  </span>
                )}
                {item.vip_only && (
                  <span className="inline-block px-2 py-1 bg-amber-500/20 text-amber-300 text-xs font-medium rounded">
                    VIP Only
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-white/10">
            <Button
              onClick={() => onEdit(item)}
              size="sm"
              className="flex-1 glass-button-primary"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(item.id)}
              size="sm"
              className="flex-1 glass-button"
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
