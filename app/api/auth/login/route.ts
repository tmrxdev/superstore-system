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
    
    // Try to find staff user with matching PIN
    const { data: staffUser, error: fetchError } = await supabase
      .from('staff')
      .select('*')
      .eq('pin', pin)
      .single()

    if (fetchError || !staffUser) {
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

    return NextResponse.json({
      user: {
        id: staffUser.id,
        email: staffUser.email,
        role: staffUser.role,
        name: staffUser.name,
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
