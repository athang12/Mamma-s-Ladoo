import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Log OTP to console for easy access during development
    console.log('\n' + '='.repeat(60))
    console.log(`📧 OTP for ${email}: ${otp}`)
    console.log(`⏰ Valid for 10 minutes`)
    console.log('='.repeat(60) + '\n')
    
    // Store OTP in Supabase with 10-minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    
    // Use upsert to handle duplicate emails (update if exists)
    const { error: dbError } = await supabase
      .from('otp_verifications')
      .upsert({
        email: email.toLowerCase(),
        otp,
        expires_at: expiresAt
      }, {
        onConflict: 'email'
      })
    
    if (dbError) {
      console.error('Error storing OTP in database:', dbError)
      throw new Error('Failed to store OTP')
    }

    // Send OTP via email using Gmail
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('⚠️ Gmail credentials not configured. OTP available in terminal only.')
        return NextResponse.json({
          success: true,
          message: 'OTP generated (configure Gmail to send emails)'
        })
      }

      // Dynamically import nodemailer
      const nodemailer = await import('nodemailer')
      
      // Create Gmail transporter
      const transporter = nodemailer.default.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      // Send email
      await transporter.sendMail({
        from: `"Signwave Store" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: 'Your Verification Code - Signwave Store',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                .otp-box { background: white; border: 2px dashed #ec4899; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                .otp-code { font-size: 32px; font-weight: bold; color: #8b5cf6; letter-spacing: 8px; }
                .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1 style="margin: 0;">🔐 Email Verification</h1>
                </div>
                <div class="content">
                  <p>Hello!</p>
                  <p>You requested to verify your email for checkout. Use the code below to complete your order:</p>
                  
                  <div class="otp-box">
                    <div style="font-size: 14px; color: #6b7280; margin-bottom: 10px;">Your verification code is:</div>
                    <div class="otp-code">${otp}</div>
                  </div>
                  
                  <p><strong>This code will expire in 10 minutes.</strong></p>
                  <p>If you didn't request this code, please ignore this email.</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} Signwave Store. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      })

      console.log(`✅ OTP email sent to ${email}`)
    } catch (emailError: any) {
      console.error('Email sending error:', emailError.message)
      console.log('⚠️ Using terminal OTP as fallback')
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email'
    })
  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}