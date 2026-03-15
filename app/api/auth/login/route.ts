import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const DEFAULT_PIN = '123123'

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin || pin.length !== 6) {
      return NextResponse.json(
        { error: 'PIN must be 6 digits' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    
    // Try to find user with matching PIN (stored as plain text for simplicity)
    const { data: users, error: fetchError } = await supabase
      .from('shop_users')
      .select('*')
      .eq('pin_hash', pin)

    if (fetchError) {
      console.error('Login fetch error:', fetchError)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    const staffUser = users && users.length > 0 ? users[0] : null

    if (!staffUser) {
      // Check if default PIN is being used (first login)
      if (pin === DEFAULT_PIN) {
        return NextResponse.json(
          {
            user: { id: 'temp', email: 'staff@superstore.local', role: 'staff', isNewUser: true },
            firstLogin: true,
          },
          { status: 200 }
        )
      }

      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      )
    }

    // Check if first login (needs to change PIN)
    if (staffUser.first_login) {
      return NextResponse.json(
        {
          user: { id: staffUser.id, email: staffUser.email, role: staffUser.role },
          firstLogin: true,
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      user: {
        id: staffUser.id,
        email: staffUser.email,
        role: staffUser.role,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
