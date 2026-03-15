import { NextRequest, NextResponse } from 'next/server'

const STAFF_PIN = '239700'

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin || pin.length !== 6) {
      return NextResponse.json(
        { error: 'PIN must be 6 digits' },
        { status: 400 }
      )
    }

    // Check if PIN matches the staff PIN
    if (pin === STAFF_PIN) {
      return NextResponse.json({
        user: {
          id: 'staff',
          email: 'staff@superstore.local',
          role: 'staff',
        },
      })
    }

    return NextResponse.json(
      { error: 'Invalid PIN' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}
