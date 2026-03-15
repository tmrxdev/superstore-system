import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: receipts, error } = await supabase
      .from('receipts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching receipts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch receipts' },
        { status: 500 }
      )
    }

    return NextResponse.json(receipts || [])
  } catch (error) {
    console.error('Error in receipts GET:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { customer_name, items, total_price, is_paid } = await request.json()

    if (!customer_name || !items || total_price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: receipt, error } = await supabase
      .from('receipts')
      .insert([
        {
          customer_name,
          items,
          total_price: parseFloat(total_price),
          is_paid: is_paid || false,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating receipt:', error)
      return NextResponse.json(
        { error: 'Failed to create receipt' },
        { status: 500 }
      )
    }

    return NextResponse.json(receipt)
  } catch (error) {
    console.error('Error in receipts POST:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
