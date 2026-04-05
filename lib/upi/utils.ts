// UPI Payment utilities for SMS-based verification

/**
 * Generate a unique amount by adding random paise
 * This prevents conflicts when multiple orders are placed simultaneously
 * 
 * @param baseAmount - The base price in rupees (e.g., 500)
 * @returns Amount with unique paise (e.g., 500.37)
 */
export function generateUniqueAmount(baseAmount: number): number {
  // Generate random paise between 1-99
  const randomPaise = Math.floor(Math.random() * 99) + 1
  // Round to 2 decimal places
  return Math.round((baseAmount + randomPaise / 100) * 100) / 100
}

/**
 * Generate UPI payment link
 * 
 * @param config - UPI payment configuration
 * @returns UPI deep link URL
 */
export interface UPIConfig {
  upiId: string          // Your UPI ID (e.g., yourname@paytm)
  name: string           // Payee name
  amount: number         // Amount with paise (e.g., 500.37)
  transactionNote?: string  // Optional note (max 50 chars, may be stripped by banks)
  transactionRef?: string   // Optional reference ID
}

export function generateUPILink(config: UPIConfig): string {
  const params = new URLSearchParams({
    pa: config.upiId,                    // Payee address (UPI ID)
    pn: config.name,                     // Payee name
    am: config.amount.toFixed(2),        // Amount (2 decimal places)
    cu: 'INR',                           // Currency
  })

  // NOTE: Removed optional tn (transaction note) and tr (transaction reference)
  // Many banks like HDFC reject transactions with these parameters
  // causing "exceeded bank limit" errors even for valid amounts

  return `upi://pay?${params.toString()}`
}

/**
 * Generate UPI QR Code data
 * Same as link but can be encoded in QR code
 */
export function generateUPIQRData(config: UPIConfig): string {
  return generateUPILink(config)
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number): string {
  return `₹${amount.toFixed(2)}`
}

/**
 * Parse UPI ID to check if valid
 */
export function isValidUPIId(upiId: string): boolean {
  // UPI ID format: username@bank
  const upiRegex = /^[\w.-]+@[\w]+$/
  return upiRegex.test(upiId)
}

/**
 * Get popular UPI apps for user selection
 */
export const UPI_APPS = [
  { id: 'paytm', name: 'Paytm', package: 'net.one97.paytm' },
  { id: 'phonepe', name: 'PhonePe', package: 'com.phonepe.app' },
  { id: 'gpay', name: 'Google Pay', package: 'com.google.android.apps.nbu.paisa.user' },
  { id: 'bhim', name: 'BHIM', package: 'in.org.npci.upiapp' },
  { id: 'amazonpay', name: 'Amazon Pay', package: 'in.amazon.mShop.android.shopping' },
]

/**
 * Generate deep link for specific UPI app
 */
export function generateAppSpecificLink(appPackage: string, upiLink: string): string {
  return `intent://${upiLink.replace('upi://', '')}#Intent;scheme=upi;package=${appPackage};end`
}
