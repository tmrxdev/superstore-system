'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface InventoryFormProps {
  item?: any
  onSave: () => void
  onCancel: () => void
}

export default function InventoryForm({ item, onSave, onCancel }: InventoryFormProps) {
  const [itemName, setItemName] = useState('')
  const [itemId, setItemId] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [eligibleForDiscount, setEligibleForDiscount] = useState(false)
  const [discountPercentage, setDiscountPercentage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [blockImage, setBlockImage] = useState('')

  useEffect(() => {
    if (item) {
      setItemName(item.item_name)
      setItemId(item.item_id)
      setImageUrl(item.image_url || '')
      setPrice(item.price.toString())
      setStock(item.stock.toString())
      setEligibleForDiscount(item.eligible_for_auto_discount)
      setDiscountPercentage(item.discount_percentage.toString())
      setBlockImage(item.image_url || '')
    }
  }, [item])

  const fetchBlockImage = async () => {
    if (!itemId) {
      setError('Please enter a Minecraft item ID first')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/minecraft/block-image?itemId=${itemId}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to fetch block image')
        return
      }

      setBlockImage(data.imageUrl)
      setImageUrl(data.imageUrl)
    } catch (err) {
      setError('Failed to fetch block image. Please enter a valid Minecraft item ID.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const body = {
        item_name: itemName,
        item_id: itemId,
        image_url: imageUrl || blockImage,
        price: parseFloat(price),
        stock: parseInt(stock),
        eligible_for_auto_discount: eligibleForDiscount,
        discount_percentage: discountPercentage ? parseInt(discountPercentage) : 0,
      }

      const url = item ? `/api/inventory/${item.id}` : '/api/inventory'
      const method = item ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Failed to save item')
        return
      }

      onSave()
    } catch (err) {
      setError('An error occurred while saving')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Item Name
            </label>
            <Input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Diamond, Emerald"
              required
              className="bg-input border-border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Minecraft Item ID
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                placeholder="e.g., minecraft:diamond"
                required
                className="bg-input border-border"
              />
              <Button
                type="button"
                onClick={fetchBlockImage}
                disabled={loading || !itemId}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {loading ? 'Loading...' : 'Fetch Image'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Price ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25000"
                required
                className="bg-input border-border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Stock
              </label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="100"
                required
                className="bg-input border-border"
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {blockImage && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Block Preview
              </label>
              <div className="bg-muted border border-border rounded p-4 flex items-center justify-center h-40">
                <img
                  src={blockImage}
                  alt={itemName}
                  className="h-32 w-32 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={eligibleForDiscount}
                onChange={(e) => setEligibleForDiscount(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">
                Eligible for Automatic Discounts
              </span>
            </label>
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              If enabled, this item can be included in daily deals
            </p>
          </div>

          {eligibleForDiscount && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Discount Percentage
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="e.g., 20"
                className="bg-input border-border"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t border-border">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-border"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  )
}
