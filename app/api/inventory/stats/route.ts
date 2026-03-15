import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('inventory')
      .select('id, stock, discount_percentage')

    if (error) throw error

    const stats = {
      totalItems: data.length,
      totalStock: data.reduce((sum, item) => sum + (item.stock || 0), 0),
      itemsWithDiscount: data.filter(item => (item.discount_percentage || 0) > 0).length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}
