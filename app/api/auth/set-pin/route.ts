import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { newPin } = await request.json()

    if (!newPin || newPin.length !== 6) {
      return NextResponse.json(
        { error: 'PIN must be 6 digits' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Insert new staff user with the PIN
    const { data: staffUser, error } = await supabase
      .from('staff')
      .insert([
        {
          email: 'staff@superstore.local',
          pin: newPin,
          role: 'staff',
          name: 'Staff Member',
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Error setting PIN:', error)
      return NextResponse.json(
        { error: 'Failed to set PIN' },
        { status: 500 }
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
    console.error('Set PIN error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
