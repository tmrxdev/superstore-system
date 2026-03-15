import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Failed to fetch inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      item_name,
      item_id,
      image_url,
      price,
      stock,
      eligible_for_auto_discount,
      discount_percentage,
      vip_only,
      vip_discount,
    } = body

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('inventory')
      .insert([
        {
          item_name,
          item_id,
          image_url,
          price,
          stock,
          eligible_for_auto_discount,
          discount_percentage,
          vip_only: vip_only || false,
          vip_discount_percentage: vip_discount || null,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Failed to create inventory item:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}
