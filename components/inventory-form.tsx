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
  const [vipOnly, setVipOnly] = useState(false)
  const [vipDiscount, setVipDiscount] = useState('')
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
      setVipOnly(item.vip_only || false)
      setVipDiscount(item.vip_discount_percentage ? item.vip_discount_percentage.toString() : '')
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
        vip_only: vipOnly,
        vip_discount_percentage: vipDiscount ? parseInt(vipDiscount) : null,
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
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Item Name
            </label>
            <Input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Diamond, Emerald"
              required
              className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Minecraft Item ID
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
                placeholder="e.g., diamond, emerald, gold_ingot"
                required
                className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
              />
              <Button
                type="button"
                onClick={fetchBlockImage}
                disabled={loading || !itemId}
                className="glass-button-primary"
              >
                {loading ? 'Loading...' : 'Fetch Image'}
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Enter item name without "minecraft:" prefix (e.g., diamond, iron_ingot)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Price ($)
              </label>
              <Input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="25000"
                required
                className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Stock
              </label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="100"
                required
                className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {blockImage && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Block Preview
              </label>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-center h-40">
                <img
                  src={blockImage}
                  alt={itemName}
                  className="h-32 w-32 object-contain rounded-lg"
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
                className="w-4 h-4 rounded border-white/20"
              />
              <span className="text-sm font-medium text-slate-300">
                Eligible for Automatic Discounts
              </span>
            </label>
            <p className="text-xs text-slate-400 mt-1 ml-6">
              If enabled, this item can be included in daily deals
            </p>
          </div>

          {eligibleForDiscount && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Discount Percentage
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
                placeholder="e.g., 20"
                className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
              />
            </div>
          )}

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={vipOnly}
                onChange={(e) => setVipOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/20"
              />
              <span className="text-sm font-medium text-slate-300">
                VIP Only Item
              </span>
            </label>
            <p className="text-xs text-slate-400 mt-1 ml-6">
              Only VIP members can purchase this item
            </p>
          </div>

          {vipOnly && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                VIP Discount (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={vipDiscount}
                onChange={(e) => setVipDiscount(e.target.value)}
                placeholder="e.g., 25"
                className="glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500"
              />
              <p className="text-xs text-slate-400 mt-1">
                Additional discount for VIP members on this item
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
        <Button
          type="button"
          onClick={onCancel}
          className="glass-button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="glass-button-primary"
        >
          {loading ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  )
}
