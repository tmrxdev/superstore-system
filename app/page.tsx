'use client'

import { useEffect, useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Footer from '@/components/footer'

export default function ShopPage() {
  const [dailyDeals, setDailyDeals] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [loading, setLoading] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchDailyDeals()
  }, [])

  const fetchDailyDeals = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/daily-deals')
      const data = await response.json()
      // Ensure we always have an array
      setDailyDeals(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch daily deals:', error)
      setDailyDeals([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (!query.trim()) {
      setSearchResults([])
      setShowSearch(false)
      return
    }

    try {
      const response = await fetch(`/api/shop/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setSearchResults(data)
      setShowSearch(true)
    } catch (error) {
      console.error('Failed to search:', error)
    }
  }

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300
      if (direction === 'left') {
        carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-blue-400">Superstore</h1>
            <a
              href="/auth/login"
              className="glass-button-primary font-medium text-sm"
            >
              Staff Portal
            </a>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full glass bg-white/10 border-white/20 text-slate-200 placeholder-slate-500 text-base py-3"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSearchResults([])
                  setShowSearch(false)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        {/* Search Results */}
        {showSearch && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-blue-300 mb-6">Search Results (Price per Stack)</h2>
            {searchResults.length === 0 ? (
              <div className="glass-lg p-12 text-center">
                <p className="text-slate-300 mb-2">No items found</p>
                <p className="text-sm text-slate-400">
                  Try searching with a different name or clear the search to see featured deals
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((item) => (
                  <ShopItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIP Section */}
        {!showSearch && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-blue-300 mb-6">VIP Benefits</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="glass-lg p-8">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">VIP Exclusive Deals</h3>
                <p className="text-slate-300 mb-4">Get special discounts on premium items available only to VIP members.</p>
                <ul className="space-y-2 text-slate-400 text-sm">
                  <li>• Up to 25% off on VIP-exclusive items</li>
                  <li>• Premium product access</li>
                  <li>• Priority stock availability</li>
                </ul>
              </div>
              <div className="glass-lg p-8">
                <h3 className="text-xl font-semibold text-blue-300 mb-4">How to Get VIP</h3>
                <p className="text-slate-300 mb-4">Earn VIP status by making purchases with us.</p>
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-slate-300 text-sm">
                  Complete <span className="text-blue-300 font-semibold">5 purchases in one month</span> to automatically unlock VIP benefits and exclusive deals.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Daily Deals Section */}
        {!showSearch && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-blue-400">Featured Deals</h2>
              <p className="text-slate-400 text-sm">Limited time offers - Price is per stack</p>
            </div>

            {loading ? (
              <div className="glass-lg p-12 text-center">
                <p className="text-slate-400">Loading deals...</p>
              </div>
            ) : dailyDeals.length === 0 ? (
              <div className="glass-lg p-12 text-center">
                <p className="text-slate-300 mb-2">No daily deals available</p>
                <p className="text-sm text-slate-400">
                  Come back tomorrow for fresh deals!
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Carousel */}
                <div
                  ref={carouselRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {dailyDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="flex-shrink-0 w-80"
                    >
                      <DailyDealCard deal={deal} />
                    </div>
                  ))}
                </div>

                {/* Carousel Controls */}
                {dailyDeals.length > 4 && (
                  <>
                    <button
                      onClick={() => scrollCarousel('left')}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 glass-button z-10"
                      aria-label="Scroll left"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 glass-button z-10"
                      aria-label="Scroll right"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

function DailyDealCard({ deal }: { deal: any }) {
  const item = deal.inventory

  if (!item) return null

  const originalPrice = item.price
  const discountedPrice = (originalPrice * (100 - deal.discount_percentage)) / 100
  const isVipOnly = item.vip_only

  return (
    <div className="glass-lg p-6 group cursor-pointer h-full flex flex-col relative overflow-hidden">
      {/* Deal Badge */}
      <div className="absolute top-4 right-4 bg-blue-500/40 border border-blue-400/60 text-blue-100 px-3 py-1 rounded-full text-sm font-bold">
        -{deal.discount_percentage}%
      </div>

      {isVipOnly && (
        <div className="absolute top-4 left-4 bg-amber-500/40 border border-amber-400/60 text-amber-100 px-2 py-1 rounded text-xs font-semibold">
          VIP ONLY
        </div>
      )}

      {/* Image */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-center h-40 mb-4 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            className="h-32 w-32 object-contain group-hover:scale-110 transition rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="text-slate-500 text-sm">No image</div>
        )}
      </div>

      {/* Item Name */}
      <h3 className="text-lg font-bold text-slate-100 mb-2">{item.item_name}</h3>

      {/* Stock */}
      <p className="text-sm text-slate-400 mb-4 flex-grow">
        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
      </p>

      {/* Price */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <p className="text-xs text-slate-500 line-through">${originalPrice.toFixed(2)}</p>
            <p className="text-2xl font-bold text-blue-400">${discountedPrice.toFixed(2)}</p>
          </div>
        </div>

        <Button
          disabled={item.stock === 0}
          className="w-full glass-button-primary disabled:opacity-50"
        >
          {item.stock > 0 ? 'View' : 'Out of Stock'}
        </Button>
      </div>
    </div>
  )
}

function ShopItem({ item }: { item: any }) {
  const isVipOnly = item.vip_only

  return (
    <div className="glass-sm p-4 hover:border-blue-400/50 transition group cursor-pointer h-full flex flex-col relative">
      {isVipOnly && (
        <div className="absolute top-2 right-2 bg-amber-500/40 border border-amber-400/60 text-amber-100 px-2 py-0.5 rounded text-xs font-semibold">
          VIP
        </div>
      )}

      {/* Image */}
      <div className="bg-white/5 border border-white/10 rounded p-3 flex items-center justify-center h-32 mb-3 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            className="h-24 w-24 object-contain group-hover:scale-110 transition rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="text-slate-500 text-xs">No image</div>
        )}
      </div>

      {/* Item Name */}
      <h3 className="text-sm font-semibold text-slate-200 mb-2 line-clamp-2">{item.item_name}</h3>

      {/* Stock */}
      <p className="text-xs text-slate-400 mb-3 flex-grow">
        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
      </p>

      {/* Price and Button */}
      <div className="pt-3 border-t border-white/10">
        <p className="text-lg font-bold text-blue-400 mb-2">${item.price.toFixed(2)}</p>
        <Button
          disabled={item.stock === 0}
          size="sm"
          className="w-full glass-button-primary disabled:opacity-50 text-xs"
        >
          {item.stock > 0 ? 'View' : 'Out'}
        </Button>
      </div>
    </div>
  )
}
