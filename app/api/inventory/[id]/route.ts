import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * If you ONLY want to allow requests from your own site(s),
 * set this to your real origin(s) instead of '*'.
 */
const ALLOW_ORIGIN = '*'

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOW_ORIGIN,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
}

export async function OPTIONS() {
  // Respond to CORS preflight
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!isUuid(params.id)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400, headers: corsHeaders() })
    }

    const body = await request.json()
    const supabase = await createClient()

    // Whitelist only fields you allow updating
    const allowed: Record<string, any> = {}
    for (const key of [
      'item_name',
      'item_id',
      'image_url',
      'price',
      'stock',
      'eligible_for_auto_discount',
      'discount_percentage',
      'vip_only',
      'vip_discount_percentage',
    ]) {
      if (body[key] !== undefined) allowed[key] = body[key]
    }

    if (Object.keys(allowed).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400, headers: corsHeaders() }
      )
    }

    const { data, error } = await supabase
      .from('inventory')
      .

