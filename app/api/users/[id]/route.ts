import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Prevent deleting superadmin
    const { data: user } = await supabase
      .from('shop_users')
      .select('role')
      .eq('id', params.id)
      .single()

    if (user?.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Cannot delete superadmin' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('shop_users')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Failed to delete user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}
