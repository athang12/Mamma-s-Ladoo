# Quick Start: Testing PhonePe Integration

## 1. Add PhonePe Test Credentials

Add these lines to your `.env.local` file:

```bash
# PhonePe Sandbox Credentials (for testing)
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 2. Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

## 3. Test the Payment Flow

1. **Add Products to Cart**: Go to `/products` and add items
2. **Go to Checkout**: Click "Checkout" from cart
3. **Fill Customer Info**: Enter name, email, phone, address
4. **Select PhonePe UPI**: Choose "PhonePe UPI" as payment method
5. **Place Order**: Click "Place Order"
6. **Test Payment Page**: You'll be redirected to PhonePe test page
7. **Use Test UPI ID**: Enter one of these test UPI IDs:
   - `success@ybl` - For successful payment
   - `failure@ybl` - For failed payment
   - `pending@ybl` - For pending payment
8. **Complete Payment**: Follow the mock payment flow
9. **View Status**: You'll be redirected back to payment status page

## 4. Check Order Status

- Go to admin panel: `/admin/orders`
- View order status and payment status
- For successful payments, status should be "paid"
- For failed payments, status should be "failed"

## What Happens During Payment:

1. Order is created in database with "pending" payment status
2. Customer is redirected to PhonePe payment page
3. After payment, PhonePe sends callback to your server
4. Payment status is updated in database
5. Customer is redirected to payment status page
6. Order confirmation email is sent (if configured)

## Testing Different Scenarios:

### Successful Payment:
- Use UPI ID: `success@ybl`
- Expected: Payment status = "paid", redirect to success page

### Failed Payment:
- Use UPI ID: `failure@ybl`
- Expected: Payment status = "failed", redirect to failure page

### Pending Payment:
- Use UPI ID: `pending@ybl`
- Expected: Payment status = "pending", can refresh to check status

## Going Live:

See [PHONEPE_SETUP.md](./PHONEPE_SETUP.md) for complete production setup instructions.

## Need Help?

- Check [PHONEPE_SETUP.md](./PHONEPE_SETUP.md) for detailed setup
- Check PhonePe developer docs: https://developer.phonepe.com/
- Check server logs for any errors
