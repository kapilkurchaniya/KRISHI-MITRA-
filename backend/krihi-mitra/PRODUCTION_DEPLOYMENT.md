# Production Deployment Setup for AI Krishi

## Overview
This guide ensures AI Krishi is properly configured for production deployment with email verification, public image hosting, and secure configuration.

## Email Verification Setup

### Supabase Email Configuration
1. **Enable Email Verification in Supabase:**
   - Go to Authentication > Providers > Email
   - Enable "Confirm email" checkbox
   - Set custom email templates if needed

2. **Auth Redirect URL Configuration:**
   - Production Domain: `https://yourdomain.com`
   - Callback URL: `https://yourdomain.com/auth/callback`
   - Update in Supabase Dashboard > Authentication > URL Configuration

3. **Email Sender Configuration:**
   - Default: Uses Supabase's built-in sender
   - Custom SMTP (Optional):
     - Go to Authentication > SMTP Settings
     - Add your custom email service (SendGrid, Mailgun, AWS SES)

### Registration Flow
- Users sign up → Receive confirmation email → Click link → Redirected to `/auth/callback` → Redirected to `/profile-setup`
- Email verification is automatic via Supabase Auth

## Public Image Hosting

### Current Image Configuration
The app uses relative URLs for images (served from `/public`):
```
/placeholder.svg       - Feature showcase images
/favicon.ico          - Browser tab icon
/manifest.webmanifest - PWA manifest
```

### Production Image CDN Setup

#### Option 1: Vercel Blob (Recommended)
```javascript
// app/(dashboard)/profile/page.tsx
{profile?.avatar_url ? (
  <img src={profile.avatar_url} alt="..." />
) : (
  <div>Initial Avatar</div>
)}
```

#### Option 2: Supabase Storage
1. Create bucket: `avatars`
2. Enable public access
3. Store URLs in database
4. Use: `https://<project-ref>.supabase.co/storage/v1/object/public/avatars/<file-path>`

#### Option 3: AWS CloudFront + S3
1. Create S3 bucket for images
2. Set up CloudFront distribution
3. Use CloudFront URL in app

### Environment Variables for Production
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://yourdomain.com/auth/callback
```

## Domain Configuration

### Update these files for production domain:

1. **Registration Callback (app/auth/register/page.tsx):**
   ```typescript
   emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
                   `${window.location.origin}/auth/callback`,
   ```
   - Automatically uses production domain from `window.location.origin`

2. **Auth Callback (app/auth/callback/route.ts):**
   ```typescript
   return NextResponse.redirect(`${origin}${next}`)
   ```
   - Uses dynamic origin from request

3. **Supabase Client (lib/supabase/client.ts):**
   ```typescript
   process.env.NEXT_PUBLIC_SUPABASE_URL
   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

## Secure Configuration Checklist

- [ ] Supabase project created and environment variables set in Vercel
- [ ] Email verification enabled in Supabase Authentication
- [ ] Production domain added to Supabase URL Configuration
- [ ] SSL certificate configured (automatic with Vercel)
- [ ] All images using public CDN URLs (no localhost)
- [ ] Database backups configured (Supabase automated)
- [ ] CORS properly configured in Supabase
- [ ] Rate limiting enabled on API routes
- [ ] Environment variables marked as production-only
- [ ] Database RLS policies verified

## Deployment to Vercel

### Step 1: Connect Repository
```bash
vercel --prod
```

### Step 2: Add Environment Variables
In Vercel Dashboard > Settings > Environment Variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- SUPABASE_JWT_SECRET

### Step 3: Configure Custom Domain
In Vercel Dashboard > Settings > Domains:
- Add your custom domain
- Update Supabase URL Configuration with new domain
- Verify DNS records

### Step 4: Test Email Verification
1. Go to `https://yourdomain.com`
2. Click "Get started"
3. Fill registration form
4. Check email for verification link
5. Verify link works and completes authentication

## Production Image URLs

Replace localhost references:

### Public Images (Static)
```
/placeholder.svg → https://yourdomain.com/placeholder.svg
/icon.svg → https://yourdomain.com/icon.svg
```

### User-Uploaded Images (Dynamic)
```
Supabase Storage: https://projectid.supabase.co/storage/v1/object/public/bucket/path
Vercel Blob: https://your-blob-url.vercel-storage.com/path
AWS S3: https://s3.amazonaws.com/bucket/path
```

## Security Best Practices

1. **HTTPS Only:**
   - All production URLs use HTTPS
   - Automatic with Vercel + custom domain

2. **Environment Variables:**
   - Never commit `.env.local` to git
   - Use Vercel's secure environment variable storage
   - Mark sensitive vars as "Sensitive"

3. **Database Security:**
   - Supabase RLS policies enforce user isolation
   - Service Role Key kept secure on backend only
   - Anon Key used for client-side operations

4. **Email Security:**
   - Supabase Auth handles email verification securely
   - Tokens expire after 24 hours
   - No user data stored in email links

5. **API Security:**
   - All routes check authentication
   - Rate limiting on public endpoints
   - Input validation on all API routes

## Monitoring & Maintenance

### Vercel Analytics
- View deployment metrics in Vercel Dashboard
- Monitor Core Web Vitals
- Track real user metrics

### Supabase Monitoring
- Check database usage and performance
- Monitor API response times
- Review authentication logs

### Email Delivery
- Monitor email delivery in Supabase Auth logs
- Test email verification monthly
- Adjust SMTP settings if needed

## Troubleshooting

### Email not received
- Check spam folder
- Verify Supabase email settings
- Confirm domain in URL Configuration
- Check email logs in Supabase Dashboard

### Images not loading
- Verify CDN URL is accessible from production domain
- Check CORS headers
- Ensure image format is supported
- Check image file exists in public folder

### Auth callback fails
- Verify NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL is set
- Check Supabase URL Configuration includes production domain
- Verify auth callback route exists at /auth/callback
- Check browser console for errors

## Rollback Plan

If production deployment fails:
1. Revert to previous Vercel deployment
2. Check environment variables
3. Verify Supabase connection
4. Review deployment logs
5. Contact Vercel + Supabase support if needed
