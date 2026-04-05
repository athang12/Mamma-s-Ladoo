// Shared OTP store for send and verify routes
// In production, use Redis or a database instead of in-memory Map

// Use global to persist the store across hot reloads in development
const globalForOtp = globalThis as unknown as {
  otpStore: Map<string, { otp: string; expires: number }> | undefined
}

export const otpStore = globalForOtp.otpStore ?? new Map<string, { otp: string; expires: number }>()

if (process.env.NODE_ENV !== 'production') {
  globalForOtp.otpStore = otpStore
}
