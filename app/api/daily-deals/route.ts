import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split('T')[0]

    // Check if daily deals already exist for today
    const { data: existingDeals } = await supabase
      .from('daily_deals')
      .select('id')
      .eq('deal_date', today)

    if (existingDeals && existingDeals.length > 0) {
      // Return existing deals for today
      const { data: deals } = await supabase
        .from('daily_deals')
        .select(`
          id,
          discount_percentage,
          inventory:inventory_id(*)
        `)
        .eq('deal_date', today)
        .order('created_at', { ascending: false })

      return NextResponse.json(deals || [])
    }

    // Generate new daily deals
    const { data: eligibleItems } = await supabase
      .from('inventory')
      .select('id')
      .eq('eligible_for_auto_discount', true)
      .gt('stock', 0)

    if (!eligibleItems || eligibleItems.length === 0) {
      return NextResponse.json([])
    }

    // Randomly select up to 15 items
    const maxDeals = Math.min(15, eligibleItems.length)
    const selectedIds = new Set<string>()

    while (selectedIds.size < maxDeals) {
      const randomIndex = Math.floor(Math.random() * eligibleItems.length)
      selectedIds.add(eligibleItems[randomIndex].id)
    }

    // Create daily deals with random discounts between 5-25%
    const deals = Array.from(selectedIds).map((id) => ({
      inventory_id: id,
      discount_percentage: Math.floor(Math.random() * (25 - 5 + 1) + 5),
      deal_date: today,
    }))

    const { data: createdDeals, error } = await supabase
      .from('daily_deals')
      .insert(deals)
      .select(`
        id,
        discount_percentage,
        inventory:inventory_id(*)
      `)

    if (error) throw error

    return NextResponse.json(createdDeals || [])
  } catch (error) {
    console.error('Failed to fetch/generate daily deals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily deals' },
      { status: 500 }
    )
  }
}
