-- UPI SMS Payment Verification System
-- This schema supports automatic payment verification via SMS forwarding

-- Table to store incoming payment SMS logs
CREATE TABLE IF NOT EXISTS payment_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  raw_message text NOT NULL,
  amount numeric(10,2),
  utr_number text,
  sender text,
  processed boolean DEFAULT false,
  matched_order_id uuid REFERENCES orders(id),
  created_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_payment_logs_amount ON payment_logs(amount);
CREATE INDEX IF NOT EXISTS idx_payment_logs_processed ON payment_logs(processed);
CREATE INDEX IF NOT EXISTS idx_payment_logs_created_at ON payment_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_logs_utr ON payment_logs(utr_number);

-- Function to automatically match payments to orders
CREATE OR REPLACE FUNCTION match_payment_to_order()
RETURNS TRIGGER AS $$
DECLARE
  matching_order_id uuid;
BEGIN
  -- Only process if amount is found
  IF NEW.amount IS NOT NULL AND NEW.amount > 0 THEN
    -- Find matching pending order within last 30 minutes with exact amount
    SELECT id INTO matching_order_id
    FROM orders
    WHERE payment_status = 'PENDING'
      AND payment_method = 'UPI_SMS'
      AND total = NEW.amount
      AND created_at > NOW() - INTERVAL '30 minutes'
    ORDER BY created_at DESC
    LIMIT 1;

    -- If match found, update order and mark as processed
    IF matching_order_id IS NOT NULL THEN
      -- Update order status
      UPDATE orders
      SET payment_status = 'COMPLETED',
          payment_completed_at = NOW(),
          payment_transaction_id = NEW.utr_number,
          updated_at = NOW()
      WHERE id = matching_order_id;

      -- Update payment log
      NEW.processed := true;
      NEW.matched_order_id := matching_order_id;
      NEW.processed_at := NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-match payments
DROP TRIGGER IF EXISTS auto_match_payment ON payment_logs;
CREATE TRIGGER auto_match_payment
  BEFORE INSERT ON payment_logs
  FOR EACH ROW
  EXECUTE FUNCTION match_payment_to_order();

-- Add UPI_SMS payment method to orders if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid  
    WHERE t.typname = 'payment_method_enum' 
    AND e.enumlabel = 'UPI_SMS'
  ) THEN
    ALTER TYPE payment_method_enum ADD VALUE IF NOT EXISTS 'UPI_SMS';
  END IF;
EXCEPTION
  WHEN others THEN
    -- If enum doesn't exist or can't be modified, just continue
    NULL;
END $$;

-- View to check recent unmatched payments
CREATE OR REPLACE VIEW unmatched_payments AS
SELECT 
  id,
  amount,
  utr_number,
  created_at,
  raw_message
FROM payment_logs
WHERE processed = false
  AND created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;

-- View to see payment matching statistics
CREATE OR REPLACE VIEW payment_stats AS
SELECT
  COUNT(*) FILTER (WHERE processed = true) as matched_payments,
  COUNT(*) FILTER (WHERE processed = false) as unmatched_payments,
  SUM(amount) FILTER (WHERE processed = true) as total_matched_amount,
  MAX(created_at) FILTER (WHERE processed = true) as last_matched_payment
FROM payment_logs
WHERE created_at > NOW() - INTERVAL '24 hours';

-- Function to manually match a payment to an order
CREATE OR REPLACE FUNCTION manual_match_payment(
  payment_log_id uuid,
  order_id uuid
)
RETURNS boolean AS $$
BEGIN
  -- Update payment log
  UPDATE payment_logs
  SET processed = true,
      matched_order_id = order_id,
      processed_at = NOW()
  WHERE id = payment_log_id;

  -- Update order
  UPDATE orders
  SET payment_status = 'COMPLETED',
      payment_completed_at = NOW(),
      payment_transaction_id = (
        SELECT utr_number FROM payment_logs WHERE id = payment_log_id
      ),
      updated_at = NOW()
  WHERE id = order_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for webhook)
CREATE POLICY "Allow webhook inserts" ON payment_logs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow authenticated reads
CREATE POLICY "Allow authenticated reads" ON payment_logs
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow anonymous to read own recent payments (for polling)
CREATE POLICY "Allow polling recent payments" ON payment_logs
  FOR SELECT
  TO anon, authenticated
  USING (created_at > NOW() - INTERVAL '30 minutes');

COMMENT ON TABLE payment_logs IS 'Stores incoming payment notifications from SMS forwarding';
COMMENT ON COLUMN payment_logs.raw_message IS 'Original SMS message text';
COMMENT ON COLUMN payment_logs.amount IS 'Extracted payment amount with paise';
COMMENT ON COLUMN payment_logs.utr_number IS 'Extracted UTR/Reference number';
COMMENT ON COLUMN payment_logs.processed IS 'Whether this payment has been matched to an order';
COMMENT ON COLUMN payment_logs.matched_order_id IS 'Order that was matched to this payment';
