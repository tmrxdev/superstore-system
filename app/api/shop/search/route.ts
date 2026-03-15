import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get('q')

    const supabase = await createClient()

    if (!query) {
      const { data } = await supabase
        .from('inventory')
        .select('id, item_name, image_url, price, stock')
        .gt('stock', 0)
        .limit(20)

      return NextResponse.json(data || [])
    }

    const { data } = await supabase
      .from('inventory')
      .select('id, item_name, image_url, price, stock')
      .ilike('item_name', `%${query}%`)
      .gt('stock', 0)
      .limit(20)

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Failed to search inventory:', error)
    return NextResponse.json(
      { error: 'Failed to search inventory' },
      { status: 500 }
    )
  }
}
