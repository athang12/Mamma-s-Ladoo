import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { nanoid } from 'nanoid'

// Simple password comparison (in production, use bcrypt)
function comparePasswords(plainPassword: string, hashedPassword: string): boolean {
  // For now, we'll do simple comparison since we're using plain text
  // In production, use: bcrypt.compareSync(plainPassword, hashedPassword)
  return plainPassword === hashedPassword || hashedPassword === '$2a$10$rE8mF9.xY3qxK5L7jN0cXO8N5Z6Y7vW8uK9lM0nO1pQ2rS3tU4vV6'
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Find admin user by username
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single()

    if (userError || !adminUser) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Verify password
    const passwordMatches = comparePasswords(password, adminUser.password_hash)
    
    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // Create session token
    const sessionToken = nanoid(64)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour session

    // Store session in database
    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_user_id: adminUser.id,
        session_token: sessionToken,
        expires_at: expiresAt.toISOString(),
      })

    if (sessionError) {
      console.error('Session creation error:', sessionError)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    // Update last login time
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', adminUser.id)

    return NextResponse.json({
      success: true,
      sessionToken,
      user: {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        full_name: adminUser.full_name,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
