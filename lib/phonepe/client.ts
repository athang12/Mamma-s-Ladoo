import crypto from 'crypto'

// PhonePe API Configuration
const PHONEPE_CONFIG = {
  merchantId: process.env.PHONEPE_MERCHANT_ID || '',
  saltKey: process.env.PHONEPE_SALT_KEY || '',
  saltIndex: process.env.PHONEPE_SALT_INDEX || '1',
  apiBaseUrl: process.env.PHONEPE_ENV === 'production'
    ? 'https://api.phonepe.com/apis/hermes'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox',
  redirectUrl: process.env.NEXT_PUBLIC_APP_URL + '/payment/status',
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL + '/api/payment/callback',
}

interface PaymentRequest {
  orderId: string
  amount: number // in rupees
  customerName: string
  customerEmail: string
  customerPhone: string
}

interface PaymentResponse {
  success: boolean
  code?: string
  message?: string
  data?: {
    merchantId: string
    merchantTransactionId: string
    instrumentResponse?: {
      redirectInfo?: {
        url: string
        method: string
      }
    }
  }
}

/**
 * Generate checksum for PhonePe API authentication
 */
function generateChecksum(payload: string, endpoint: string): string {
  const string = payload + endpoint + PHONEPE_CONFIG.saltKey
  const sha256 = crypto.createHash('sha256').update(string).digest('hex')
  return sha256 + '###' + PHONEPE_CONFIG.saltIndex
}

/**
 * Verify callback checksum from PhonePe
 */
export function verifyChecksum(xVerify: string, response: string): boolean {
  const [receivedChecksum] = xVerify.split('###')
  const calculatedChecksum = crypto
    .createHash('sha256')
    .update(response + PHONEPE_CONFIG.saltKey)
    .digest('hex')
  
  return receivedChecksum === calculatedChecksum
}

/**
 * Initiate payment with PhonePe
 */
export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    const merchantTransactionId = `TXN_${request.orderId}_${Date.now()}`
    
    // Payment request payload
    const paymentPayload = {
      merchantId: PHONEPE_CONFIG.merchantId,
      merchantTransactionId,
      merchantUserId: `USER_${request.customerPhone}`,
      amount: Math.round(request.amount * 100), // Convert to paise
      redirectUrl: PHONEPE_CONFIG.redirectUrl,
      redirectMode: 'POST',
      callbackUrl: PHONEPE_CONFIG.callbackUrl,
      mobileNumber: request.customerPhone,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    }

    // Encode payload to base64
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64')
    
    // Generate checksum
    const endpoint = '/pg/v1/pay'
    const checksum = generateChecksum(base64Payload, endpoint)

    // Make API request
    const response = await fetch(`${PHONEPE_CONFIG.apiBaseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    })

    const result = await response.json()
    
    if (result.success && result.data?.instrumentResponse?.redirectInfo?.url) {
      return {
        success: true,
        code: result.code,
        message: result.message,
        data: {
          merchantId: result.data.merchantId,
          merchantTransactionId: result.data.merchantTransactionId,
          instrumentResponse: result.data.instrumentResponse,
        },
      }
    }

    return {
      success: false,
      message: result.message || 'Failed to initiate payment',
    }
  } catch (error) {
    console.error('PhonePe payment initiation error:', error)
    return {
      success: false,
      message: 'Payment service unavailable',
    }
  }
}

/**
 * Check payment status
 */
export async function checkPaymentStatus(merchantTransactionId: string): Promise<PaymentResponse> {
  try {
    const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.merchantId}/${merchantTransactionId}`
    const string = endpoint + PHONEPE_CONFIG.saltKey
    const checksum = crypto.createHash('sha256').update(string).digest('hex') + '###' + PHONEPE_CONFIG.saltIndex

    const response = await fetch(`${PHONEPE_CONFIG.apiBaseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': PHONEPE_CONFIG.merchantId,
      },
    })

    const result = await response.json()
    
    return {
      success: result.success,
      code: result.code,
      message: result.message,
      data: result.data,
    }
  } catch (error) {
    console.error('PhonePe status check error:', error)
    return {
      success: false,
      message: 'Failed to check payment status',
    }
  }
}

export { PHONEPE_CONFIG }
