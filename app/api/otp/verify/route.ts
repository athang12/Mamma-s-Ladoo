import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format' },
        { status: 400 }
      )
    }

    // Get stored OTP from Supabase
    const { data: stored, error: fetchError } = await supabase
      .from('otp_verifications')
      .select('otp, expires_at')
      .eq('email', email.toLowerCase())
      .single()

    if (fetchError || !stored) {
      console.error('OTP not found for:', email, fetchError)
      return NextResponse.json(
        { error: 'OTP not found or expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if OTP is expired
    if (new Date(stored.expires_at) < new Date()) {
      // Delete expired OTP
      await supabase
        .from('otp_verifications')
        .delete()
        .eq('email', email.toLowerCase())
      
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (stored.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // OTP verified successfully - remove it from database
    await supabase
      .from('otp_verifications')
      .delete()
      .eq('email', email.toLowerCase())
    
    console.log(`OTP verified successfully for: ${email}`)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
      verified: true
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
