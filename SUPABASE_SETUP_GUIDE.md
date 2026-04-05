# Supabase Setup Guide

Follow these steps to set up your Supabase project for the custom acrylic store.

## Step 1: Create Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** or **"Sign In"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if prompted

## Step 2: Create New Project

1. Once logged in, click **"New Project"**
2. Fill in the details:
   - **Name**: `custom-acrylic-store` (or your preferred name)
   - **Database Password**: Create a strong password (SAVE THIS - you'll need it!)
   - **Region**: Choose closest to your target audience (e.g., `Asia South (Mumbai)` for India)
   - **Pricing Plan**: Start with **Free** tier (perfect for development)
3. Click **"Create new project"**
4. Wait 2-3 minutes for project to be provisioned

## Step 3: Get Your Project Credentials

Once your project is ready:

1. In the Supabase dashboard, click on **"Settings"** (gear icon in left sidebar)
2. Go to **"API"** section
3. You'll see these credentials - **COPY AND SAVE THEM**:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)
   - **service_role key**: `eyJhbGc...` (another long string - keep this SECRET!)

## Step 4: Set Up Database Schema

1. In Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. Copy the SQL from `supabase/schema.sql` file (I'll create this next)
4. Paste it into the SQL editor
5. Click **"Run"** button
6. You should see "Success. No rows returned" message

## Step 5: Configure Storage Bucket

1. In Supabase dashboard, click **"Storage"** in left sidebar
2. Click **"Create a new bucket"**
3. Settings:
   - **Name**: `custom-images`
   - **Public bucket**: ✅ Enable (so images can be viewed)
   - **File size limit**: 5 MB
   - **Allowed MIME types**: `image/png, image/jpeg, image/jpg, image/webp`
4. Click **"Create bucket"**

## Step 6: Add Credentials to Your App

1. In your project folder, create a file: `.env.local`
2. Add these lines (replace with YOUR actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key...
```

3. Save the file
4. **IMPORTANT**: Never commit `.env.local` to git (already in .gitignore)

## Step 7: Test Connection

After I set up the code integration, you can test by:
1. Running `npm run dev`
2. Going to http://localhost:3000/admin
3. You should see the admin panel connect to Supabase

## Troubleshooting

**Can't connect to Supabase?**
- Check your `.env.local` file has correct credentials
- Make sure you copied the full keys (they're very long)
- Restart your dev server after adding env variables

**Storage not working?**
- Verify bucket is set to "Public"
- Check MIME types include image formats
- Ensure file size limit is appropriate (5MB+)

**Database errors?**
- Re-run the schema.sql in SQL Editor
- Check "Table Editor" to verify tables were created

## Next Steps

Once you complete these steps, let me know and I'll:
1. ✅ Set up the Supabase client in the app
2. ✅ Create the admin panel
3. ✅ Migrate product data to database
4. ✅ Implement image uploads
5. ✅ Connect order system to Supabase

---

**Need help?** Let me know which step you're stuck on and I'll assist!
