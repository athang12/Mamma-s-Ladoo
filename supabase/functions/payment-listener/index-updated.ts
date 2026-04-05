// Supabase Edge Function to receive SMS webhooks from Android phone
// This function extracts payment details from bank SMS and stores them

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Common Indian bank SMS patterns
const BANK_PATTERNS = {
  // HDFC Bank: "Rs 500.50 credited to A/c XX1234 on 24-01-26. Ref No 401234567890"
  HDFC: {
    amount: /Rs\.?\s*(\d+(?:\.\d{1,2})?)\s*(?:credited|received|deposited)/i,
    utr: /Ref\s?No\.?\s*(\d+)/i
  },
  // SBI: "INR 500.50 credited to A/c XX1234. UPI/401234567890"
  SBI: {
    amount: /(?:INR|Rs\.?)\s*(\d+(?:\.\d{1,2})?)\s*(?:credited|received)/i,
    utr: /UPI\/(\d+)/i
  },
  // ICICI: "Rs.500.50 credited to A/c XX1234. Info: UPI-401234567890"
  ICICI: {
    amount: /Rs\.?\s*(\d+(?:\.\d{1,2})?)\s*credited/i,
    utr: /(?:UPI-|Ref\s?No\.?\s*)(\d+)/i
  },
  // Axis Bank: "INR 500.50 received in A/c XX1234. UPI Ref No 401234567890"
  AXIS: {
    amount: /(?:INR|Rs\.?)\s*(\d+(?:\.\d{1,2})?)\s*received/i,
    utr: /UPI\s*Ref\s*No\.?\s*(\d+)/i
  },
  // Generic fallback pattern
  GENERIC: {
    amount: /(?:Rs\.?|INR|₹)\s*(\d+(?:\.\d{1,2})?)/i,
    utr: /(?:Ref\s?No\.?|UPI|UTR)[\s:]*(\d{12,})/i
  }
}

function extractPaymentDetails(message: string, sender: string) {
  let amount = 0
  let utr = null

  // Try to detect bank from sender
  let patterns = BANK_PATTERNS.GENERIC
  
  if (sender.includes('HDFC')) patterns = BANK_PATTERNS.HDFC
  else if (sender.includes('SBI')) patterns = BANK_PATTERNS.SBI
  else if (sender.includes('ICICI')) patterns = BANK_PATTERNS.ICICI
  else if (sender.includes('AXIS')) patterns = BANK_PATTERNS.AXIS

  // Extract amount
  const amountMatch = message.match(patterns.amount)
  if (amountMatch) {
    amount = parseFloat(amountMatch[1])
  }

  // Extract UTR/Reference number
  const utrMatch = message.match(patterns.utr)
  if (utrMatch) {
    utr = utrMatch[1]
  }

  return { amount, utr }
}

serve(async (req) => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', { 
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      })
    }

    let message: string
    let sender: string
    let received_at: string | undefined

    // Accept both POST with JSON body and GET with URL parameters
    if (req.method === 'POST') {
      const body = await req.json()
      message = body.message
      sender = body.sender
      received_at = body.received_at
    } else if (req.method === 'GET') {
      const url = new URL(req.url)
      message = url.searchParams.get('message') || ''
      sender = url.searchParams.get('sender') || ''
      received_at = url.searchParams.get('received_at') || undefined
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message format' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Only process credit/received messages (ignore debit)
    if (!message.match(/(?:credited|received|deposited)/i)) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Not a credit message, ignored' 
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Extract payment details
    const { amount, utr } = extractPaymentDetails(message, sender || '')

    console.log('Extracted:', { amount, utr, sender })

    // Only process if amount is found
    if (amount <= 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No valid amount found in SMS' 
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Insert into payment_logs
    // The trigger will automatically try to match with pending orders
    const { data, error } = await supabase
      .from('payment_logs')
      .insert({
        raw_message: message,
        amount: amount,
        utr_number: utr,
        sender: sender || 'UNKNOWN',
        processed: false
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Database error',
          details: error.message 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log('Payment log created:', data)

    // Return success with extracted details
    return new Response(
      JSON.stringify({ 
        success: true,
        data: {
          id: data.id,
          amount: amount,
          utr: utr,
          processed: data.processed,
          matched_order: data.matched_order_id
        },
        message: data.processed 
          ? 'Payment matched to order automatically' 
          : 'Payment logged, waiting for matching order'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    )
  }
})
