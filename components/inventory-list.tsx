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
    return <p className="text-muted-foreground">Loading inventory...</p>
  }

  if (items.length === 0) {
    return (
      <Card className="p-12 border-border text-center">
        <p className="text-muted-foreground mb-4">No items in inventory yet</p>
        <p className="text-sm text-muted-foreground">
          Click "Add Item" to create your first inventory item
        </p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card key={item.id} className="p-6 border-border hover:border-primary/50 transition">
          {item.image_url && (
            <div className="mb-4 bg-muted rounded p-4 flex items-center justify-center h-40">
              <img
                src={item.image_url}
                alt={item.item_name}
                className="h-32 w-32 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}

          <h3 className="text-lg font-semibold text-foreground mb-2">{item.item_name}</h3>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono text-foreground">{item.item_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price:</span>
              <span className="text-primary font-semibold">${item.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stock:</span>
              <span className={item.stock > 0 ? 'text-foreground' : 'text-destructive'}>
                {item.stock} {item.stock === 0 && '(Out of stock)'}
              </span>
            </div>

            {item.eligible_for_auto_discount && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount:</span>
                <span className="text-accent">{item.discount_percentage}%</span>
              </div>
            )}

            {item.eligible_for_auto_discount && (
              <div className="pt-2">
                <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded">
                  Daily Deal Eligible
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button
              onClick={() => onEdit(item)}
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(item.id)}
              size="sm"
              variant="outline"
              className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}
