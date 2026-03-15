import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

export async function authenticate(email: string, password: string) {
  const supabase = await createClient()

  // Query the shop_users table
  const { data: users, error } = await supabase
    .from('shop_users')
    .select('id, email, password_hash, role')
    .eq('email', email)
    .limit(1)

  if (error || !users || users.length === 0) {
    return { success: false, error: 'Invalid email or password' }
  }

  const user = users[0]
  const passwordMatch = await bcrypt.compare(password, user.password_hash)

  if (!passwordMatch) {
    return { success: false, error: 'Invalid email or password' }
  }

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function getUserById(id: string) {
  const supabase = await createClient()

  const { data: user, error } = await supabase
    .from('shop_users')
    .select('id, email, role')
    .eq('id', id)
    .single()

  if (error) return null
  return user
}

export async function createUser(email: string, password: string, role: 'staff' | 'superadmin' = 'staff', createdBy?: string) {
  const supabase = await createClient()
  const passwordHash = await hashPassword(password)

  const { data: user, error } = await supabase
    .from('shop_users')
    .insert([
      {
        email,
        password_hash: passwordHash,
        role,
        created_by: createdBy || null,
        first_login: true,
      },
    ])
    .select('id, email, role')
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, user }
}
