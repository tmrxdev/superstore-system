import { NextRequest, NextResponse } from 'next/server'

// Use the minecraftitems.xyz API for item images
// Format: https://api.minecraftitems.xyz/api/item/<ITEM>
// No "minecraft:" prefix needed

export async function GET(request: NextRequest) {
  try {
    const itemId = request.nextUrl.searchParams.get('itemId')

    if (!itemId) {
      return NextResponse.json(
        { error: 'itemId parameter is required' },
        { status: 400 }
      )
    }

    // Remove "minecraft:" prefix if present and convert to lowercase
    let normalizedId = itemId.toLowerCase().replace('minecraft:', '')
    
    // Build the image URL using the minecraftitems.xyz API
    const imageUrl = `https://api.minecraftitems.xyz/api/item/${normalizedId}`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Failed to fetch block image:', error)
    return NextResponse.json(
      { error: 'Failed to fetch block image' },
      { status: 500 }
    )
  }
}
