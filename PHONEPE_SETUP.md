# PhonePe Payment Integration Setup Guide

## Overview
This guide will help you set up PhonePe payment gateway integration for UPI payments in your e-commerce store.

## Prerequisites
- PhonePe merchant account
- Registered business entity in India
- Valid bank account for settlements

## Step 1: Create PhonePe Merchant Account

1. **Visit PhonePe Business**: Go to [https://business.phonepe.com/](https://business.phonepe.com/)

2. **Sign Up**: Register your business with the following information:
   - Business name
   - Business PAN
   - Business address
   - Bank account details
   - Authorized signatory details

3. **Complete KYC**: Upload required documents:
   - Business registration certificate
   - PAN card
   - Address proof
   - Cancelled cheque
   - Signatory ID proof

4. **Wait for Approval**: PhonePe will verify your documents (typically 2-3 business days)

## Step 2: Get API Credentials

Once your account is approved:

1. **Login to Merchant Dashboard**: [https://www.phonepe.com/business-solutions/payment-gateway/](https://www.phonepe.com/business-solutions/payment-gateway/)

2. **Navigate to Developer Section**: Go to "Developer" or "API Credentials"

3. **Get Your Credentials**:
   - **Merchant ID**: Your unique merchant identifier (e.g., `M1234567890`)
   - **Salt Key**: Secret key for API authentication
   - **Salt Index**: Index number for the salt key (usually `1`)

4. **Choose Environment**:
   - **Sandbox/UAT**: For testing (no real money transactions)
   - **Production**: For live transactions

## Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# PhonePe Configuration
PHONEPE_MERCHANT_ID=your_merchant_id_here
PHONEPE_SALT_KEY=your_salt_key_here
PHONEPE_SALT_INDEX=1

# Set to 'production' for live mode, leave blank or 'sandbox' for testing
PHONEPE_ENV=sandbox

# Your app URL (needed for callbacks and redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### For Production:
```bash
PHONEPE_MERCHANT_ID=M1234567890
PHONEPE_SALT_KEY=abcd1234-5678-90ef-ghij-klmnopqrstuv
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### For Testing (Sandbox):
```bash
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Test Integration

### Using Sandbox Credentials:
1. Use the test credentials provided above
2. Start your development server: `npm run dev`
3. Go to checkout and select "PhonePe UPI"
4. Complete the order
5. You'll be redirected to PhonePe's test payment page
6. Use test UPI IDs provided by PhonePe for testing

### Test UPI IDs (Sandbox):
- **Success**: `success@ybl`
- **Failure**: `failure@ybl`
- **Pending**: `pending@ybl`

## Step 5: Webhook Configuration

1. **Login to PhonePe Dashboard**
2. **Go to Webhooks Settings**
3. **Add Callback URL**: `https://yourdomain.com/api/payment/callback`
4. **Save Configuration**

Important: The callback URL must be publicly accessible (not localhost)

## Step 6: Go Live

Before going live:

1. **Complete Production Onboarding**:
   - Submit additional documents if required
   - Complete risk assessment
   - Get production credentials

2. **Update Environment Variables**:
   - Replace sandbox credentials with production credentials
   - Update `PHONEPE_ENV` to `production`
   - Update `NEXT_PUBLIC_APP_URL` to your production domain

3. **Test Thoroughly**:
   - Test with small amounts first
   - Verify callback handling
   - Check payment status updates
   - Test refund flow (if implemented)

4. **Deploy to Production**:
   - Deploy your application with production credentials
   - Ensure SSL is properly configured
   - Test end-to-end payment flow

## Payment Flow

1. **Customer selects UPI payment** at checkout
2. **Order created** in database with 'pending' status
3. **Payment initiated** with PhonePe API
4. **Customer redirected** to PhonePe payment page
5. **Customer completes payment** using UPI app
6. **PhonePe sends callback** to your server
7. **Payment status updated** in database
8. **Customer redirected** to payment status page

## Troubleshooting

### Invalid Checksum Error
- Verify your Salt Key and Salt Index are correct
- Ensure no extra spaces in environment variables
- Check if payload encoding is correct

### Callback Not Received
- Ensure callback URL is publicly accessible
- Check if SSL certificate is valid
- Verify webhook configuration in PhonePe dashboard

### Payment Status Not Updating
- Check server logs for callback errors
- Verify database update function is working
- Test payment status check API manually

### Redirect Issues
- Ensure `NEXT_PUBLIC_APP_URL` is set correctly
- Check if redirect URL in payment initiation is correct
- Verify CORS settings if applicable

## API Endpoints

Your application has the following endpoints:

- `POST /api/payment/initiate` - Initiate payment with PhonePe
- `POST /api/payment/callback` - Receive payment callbacks from PhonePe
- `POST /api/payment/status` - Check payment status
- `GET /payment/status` - Payment status page for customers

## Security Best Practices

1. **Never expose** Salt Key in client-side code
2. **Always verify** checksums in callbacks
3. **Use HTTPS** in production
4. **Validate** all payment amounts before processing
5. **Log** all payment transactions for audit
6. **Implement** rate limiting on payment endpoints
7. **Store** sensitive data securely

## Support

- **PhonePe Support**: [support@phonepe.com](mailto:support@phonepe.com)
- **Developer Docs**: [https://developer.phonepe.com/](https://developer.phonepe.com/)
- **Merchant Dashboard**: [https://business.phonepe.com/](https://business.phonepe.com/)

## Testing Checklist

- [ ] Sandbox credentials configured
- [ ] Test payment initiation
- [ ] Test successful payment
- [ ] Test failed payment
- [ ] Test pending payment
- [ ] Test callback handling
- [ ] Test payment status updates
- [ ] Test order status updates
- [ ] Test redirect flows
- [ ] Check database records
- [ ] Verify email notifications (if implemented)
- [ ] Test with different amounts
- [ ] Test with different UPI apps

## Production Checklist

- [ ] Production credentials obtained
- [ ] Environment variables updated
- [ ] Callback URL configured
- [ ] SSL certificate installed
- [ ] Domain verified
- [ ] Test with real payment
- [ ] Monitor payment logs
- [ ] Set up error alerts
- [ ] Document payment process
- [ ] Train support team
