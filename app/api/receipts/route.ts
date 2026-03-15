import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Fetch receipts with their items
    const { data: receipts, error } = await supabase
      .from('receipts')
      .select(`
        *,
        receipt_items (*)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching receipts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch receipts' },
        { status: 500 }
      )
    }

    // Transform the data to include items as a string for display
    const transformedReceipts = (receipts || []).map((receipt: any) => ({
      ...receipt,
      items: receipt.receipt_items
        ?.map((item: any) => `${item.item_name} x${item.quantity}`)
        .join(', ') || 'No items'
    }))

    return NextResponse.json(transformedReceipts)
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

    // First create the receipt
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .insert([
        {
          customer_name,
          total_price: parseFloat(total_price),
          is_paid: is_paid || false,
        }
      ])
      .select()
      .single()

    if (receiptError) {
      console.error('Error creating receipt:', receiptError)
      return NextResponse.json(
        { error: 'Failed to create receipt' },
        { status: 500 }
      )
    }

    // Parse items string and create receipt_items entries
    // Expected format: "Diamond x10, Emerald x5" or just "Diamond, Emerald"
    const itemsList = items.split(',').map((item: string) => item.trim())
    const receiptItems = itemsList.map((itemStr: string) => {
      const match = itemStr.match(/^(.+?)\s*x\s*(\d+)$/i)
      if (match) {
        return {
          receipt_id: receipt.id,
          item_name: match[1].trim(),
          quantity: parseInt(match[2]),
          price_per_item: 0, // Price tracking is optional
        }
      }
      return {
        receipt_id: receipt.id,
        item_name: itemStr,
        quantity: 1,
        price_per_item: 0,
      }
    })

    const { error: itemsError } = await supabase
      .from('receipt_items')
      .insert(receiptItems)

    if (itemsError) {
      console.error('Error creating receipt items:', itemsError)
      // Receipt was created, items failed - return receipt anyway
    }

    return NextResponse.json({ ...receipt, items })
  } catch (error) {
    console.error('Error in receipts POST:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
