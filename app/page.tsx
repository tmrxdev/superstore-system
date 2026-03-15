'use client'

import { useEffect, useState, useRef } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

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
      setDailyDeals(data)
    } catch (error) {
      console.error('Failed to fetch daily deals:', error)
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-primary">⛏️ Minecraft Shop</h1>
            <a
              href="/auth/login"
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm"
            >
              Staff Login
            </a>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for blocks and items..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-input border-border text-lg py-3"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSearchResults([])
                  setShowSearch(false)
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Results */}
        {showSearch && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Search Results</h2>
            {searchResults.length === 0 ? (
              <Card className="p-12 border-border text-center">
                <p className="text-muted-foreground mb-2">No items found</p>
                <p className="text-sm text-muted-foreground">
                  Try searching with a different name or clear the search to see daily deals
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchResults.map((item) => (
                  <ShopItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Daily Deals Section */}
        {!showSearch && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-primary">🎁 Daily Deals</h2>
              <p className="text-muted-foreground text-sm">Limited time offers</p>
            </div>

            {loading ? (
              <Card className="p-12 border-border text-center">
                <p className="text-muted-foreground">Loading deals...</p>
              </Card>
            ) : dailyDeals.length === 0 ? (
              <Card className="p-12 border-border text-center">
                <p className="text-muted-foreground mb-2">No daily deals available</p>
                <p className="text-sm text-muted-foreground">
                  Come back tomorrow for fresh deals!
                </p>
              </Card>
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
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 z-10"
                      aria-label="Scroll left"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => scrollCarousel('right')}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 z-10"
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
    </div>
  )
}

function DailyDealCard({ deal }: { deal: any }) {
  const item = deal.inventory

  if (!item) return null

  const originalPrice = item.price
  const discountedPrice = (originalPrice * (100 - deal.discount_percentage)) / 100

  return (
    <Card className="p-4 border-accent/50 bg-gradient-to-br from-card to-muted hover:border-accent transition group cursor-pointer h-full flex flex-col">
      {/* Deal Badge */}
      <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
        -{deal.discount_percentage}%
      </div>

      {/* Image */}
      <div className="bg-muted rounded p-4 flex items-center justify-center h-40 mb-4 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            className="h-32 w-32 object-contain group-hover:scale-110 transition"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="text-muted-foreground">No image</div>
        )}
      </div>

      {/* Item Name */}
      <h3 className="text-lg font-bold text-foreground mb-2">{item.item_name}</h3>

      {/* Stock */}
      <p className="text-sm text-muted-foreground mb-4 flex-grow">
        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
      </p>

      {/* Price */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <p className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(2)}</p>
            <p className="text-2xl font-bold text-accent">${discountedPrice.toFixed(2)}</p>
          </div>
        </div>

        <Button
          disabled={item.stock === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </Card>
  )
}

function ShopItem({ item }: { item: any }) {
  return (
    <Card className="p-4 border-border hover:border-primary/50 transition group cursor-pointer h-full flex flex-col">
      {/* Image */}
      <div className="bg-muted rounded p-3 flex items-center justify-center h-32 mb-3 overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.item_name}
            className="h-24 w-24 object-contain group-hover:scale-110 transition"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="text-muted-foreground text-xs">No image</div>
        )}
      </div>

      {/* Item Name */}
      <h3 className="text-sm font-semibold text-foreground mb-2 line-clamp-2">{item.item_name}</h3>

      {/* Stock */}
      <p className="text-xs text-muted-foreground mb-3 flex-grow">
        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
      </p>

      {/* Price and Button */}
      <div className="pt-3 border-t border-border">
        <p className="text-lg font-bold text-primary mb-2">${item.price.toFixed(2)}</p>
        <Button
          disabled={item.stock === 0}
          size="sm"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          {item.stock > 0 ? 'Buy' : 'Out'}
        </Button>
      </div>
    </Card>
  )
}
