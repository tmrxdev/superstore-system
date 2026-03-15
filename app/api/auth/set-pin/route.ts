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

    // Check if any user exists - if so, this is a PIN change for existing user
    const { data: existingUsers } = await supabase
      .from('shop_users')
      .select('id')
      .limit(1)

    if (existingUsers && existingUsers.length > 0) {
      // Update existing user's PIN (first user found)
      const { data: updatedUser, error: updateError } = await supabase
        .from('shop_users')
        .update({ 
          pin_hash: newPin,
          first_login: false 
        })
        .eq('id', existingUsers[0].id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating PIN:', updateError)
        return NextResponse.json(
          { error: 'Failed to set PIN' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          role: updatedUser.role,
        },
      })
    }

    // Insert new staff user with the PIN
    const { data: staffUser, error } = await supabase
      .from('shop_users')
      .insert([
        {
          email: 'staff@superstore.local',
          pin_hash: newPin,
          role: 'staff',
          first_login: false,
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
