-- Create OTP verification table for email verification during checkout
CREATE TABLE IF NOT EXISTS otp_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email)
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_verifications(email);

-- Index for cleaning up expired OTPs
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);

-- Enable Row Level Security
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert for anyone (sending OTP)
CREATE POLICY "Allow insert OTP for anyone" ON otp_verifications
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow select for anyone (verifying OTP)
CREATE POLICY "Allow select OTP for anyone" ON otp_verifications
  FOR SELECT
  USING (true);

-- Policy: Allow update for anyone (updating existing OTP)
CREATE POLICY "Allow update OTP for anyone" ON otp_verifications
  FOR UPDATE
  USING (true);

-- Policy: Allow delete for anyone (removing verified OTP)
CREATE POLICY "Allow delete OTP for anyone" ON otp_verifications
  FOR DELETE
  USING (true);

-- Function to automatically clean up expired OTPs
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM otp_verifications WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
