# Manual Deployment Instructions for UPI Payment Webhook

Since CLI login requires interactive browser authentication, here's how to deploy the Edge Function manually:

## Option 1: Using Supabase Dashboard (Easiest!)

### Step 1: Go to Edge Functions

1. Visit: https://app.supabase.com/project/zvjieppjwztnjkifybmy/functions
2. Click "Create a new function"
3. Name: `payment-listener`
4. Click "Create function"

### Step 2: Copy the Code

1. Open: `supabase/functions/payment-listener/index.ts`
2. Copy ALL the code from that file
3. Paste it in the Supabase Dashboard editor
4. Click "Deploy"

### Step 3: Set Environment Variables

1. In the same Edge Functions page, go to "Settings" tab
2. Add these environment variables:
   - `SUPABASE_URL`: `https://zvjieppjwztnjkifybmy.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: Get from Settings → API → service_role key (secret!)

### Step 4: Get Your Webhook URL

After deployment, your webhook URL will be:
```
https://zvjieppjwztnjkifybmy.supabase.co/functions/v1/payment-listener
```

**Save this URL!** You need it for MacroDroid setup.

---

## Option 2: CLI Login (Alternative - requires manual steps)

If you want to use CLI, you need to:

1. Run in terminal: `supabase login`
2. Press Enter when prompted
3. Browser will open - click "Authorize"
4. Return to terminal

Then run:
```bash
# Link project
supabase link --project-ref zvjieppjwztnjkifybmy

# Deploy function
supabase functions deploy payment-listener

# Set secrets (you need service_role key from dashboard)
supabase secrets set SUPABASE_URL="https://zvjieppjwztnjkifybmy.supabase.co"
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

---

## Quick Start: I Recommend Option 1 (Dashboard)!

It's faster and doesn't require CLI authentication. Just:
1. Copy code from `supabase/functions/payment-listener/index.ts`
2. Paste in Supabase Dashboard
3. Add environment variables
4. Deploy!

Takes 2 minutes. 🚀

---

## After Deployment

Test your webhook:
```bash
curl -X POST https://zvjieppjwztnjkifybmy.supabase.co/functions/v1/payment-listener \
  -H "Content-Type: application/json" \
  -d '{"message":"Rs 500.37 credited to A/c XX1234","sender":"HDFCBK"}'
```

If it works, you'll see: `{"success":true,...}`

Then follow [UPI_QUICKSTART.md](./UPI_QUICKSTART.md) for Android setup!
