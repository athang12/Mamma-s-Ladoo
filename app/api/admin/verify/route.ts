import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json()

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token required' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Find valid session
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select(`
        *,
        admin_users!inner(*)
      `)
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      valid: true,
      user: {
        id: session.admin_users.id,
        username: session.admin_users.username,
        email: session.admin_users.email,
        full_name: session.admin_users.full_name,
      },
    })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
