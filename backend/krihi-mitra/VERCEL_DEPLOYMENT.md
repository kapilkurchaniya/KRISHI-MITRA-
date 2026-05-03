# Vercel Deployment Guide

## Prerequisites
- GitHub repository with AI Krishi code
- Vercel account (https://vercel.com)
- Supabase project created
- Production domain name

## Step 1: Connect GitHub Repository to Vercel

1. Visit https://vercel.com/new
2. Connect your GitHub account
3. Select the AI Krishi repository
4. Click "Import"

## Step 2: Project Setup in Vercel

**Framework Preset:** Next.js
**Root Directory:** ./
**Build Command:** `pnpm run build`
**Output Directory:** `.next`
**Install Command:** `pnpm install`

## Step 3: Environment Variables

In Vercel Dashboard > Project Settings > Environment Variables:

### Add these variables:

**NEXT_PUBLIC_SUPABASE_URL**
- Value: `https://your-project-id.supabase.co`
- Environments: Production, Preview, Development

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Value: Your Supabase anonymous key
- Environments: Production, Preview, Development

**SUPABASE_SERVICE_ROLE_KEY**
- Value: Your Supabase service role key
- Environments: Production only
- Mark as Sensitive

**SUPABASE_JWT_SECRET**
- Value: Your Supabase JWT secret
- Environments: Production only
- Mark as Sensitive

**NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL**
- Value: `https://your-production-domain.com/auth/callback`
- Environments: Production only

## Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Verify deployment logs
4. Test app at generated URL

## Step 5: Configure Custom Domain

1. In Vercel Dashboard, go to Settings > Domains
2. Add your custom domain (e.g., `yourdomain.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (usually 24 hours)

## Step 6: Update Supabase Configuration

**In Supabase Dashboard:**

1. Go to Authentication > URL Configuration
2. Update these URLs with your production domain:
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`

3. Go to Project Settings > API
4. Verify ANON_KEY and SERVICE_ROLE_KEY match Vercel env vars

## Step 7: Test Production Deployment

### Email Verification Test
1. Navigate to `https://yourdomain.com`
2. Click "Get started" button
3. Fill in registration form:
   - Name: Test Farmer
   - Email: your-test-email@gmail.com
   - Phone: +91XXXXXXXXXX
   - Password: TestPassword123!

4. Check email inbox for verification link
5. Click verification link
6. Should redirect to profile setup page

### Check Image Loading
1. Verify placeholder images load on homepage
2. Verify profile avatar displays correctly
3. Check scanner images display properly
4. Verify no console errors

### Database Verification
1. Go to Supabase Dashboard > SQL Editor
2. Run: `SELECT * FROM profiles LIMIT 1;`
3. Verify new user record created

## Continuous Deployment

**Automatic Deployment:**
- Every push to `main` branch triggers deployment
- Builds run automatically
- Production domain updates in real-time

**Manual Redeployment:**
1. Vercel Dashboard > Deployments
2. Click "Redeploy" next to any deployment
3. Select "Use existing Build Cache" (recommended)

## Monitoring Deployments

**Vercel Dashboard:**
- View all deployments and their status
- Check build logs for errors
- Monitor Performance metrics
- Set up alerts for deployment failures

**Supabase Dashboard:**
- Monitor real-time database queries
- View authentication logs
- Check API usage statistics

## Rollback to Previous Deployment

If production deployment has issues:

1. Vercel Dashboard > Deployments
2. Find the last working deployment
3. Click "Promote to Production"
4. App reverts to previous version immediately

## Troubleshooting Deployment

### Build Fails
- Check build logs in Vercel Dashboard
- Verify all environment variables are set
- Ensure package.json has all dependencies
- Try manual rebuild

### App Crashes After Deploy
- Check Vercel Function Logs
- Verify Supabase connection
- Confirm environment variables are correct
- Check browser console for errors

### Email Verification Not Working
- Verify NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL is set
- Confirm domain in Supabase URL Configuration
- Check Supabase Authentication settings
- Test with different email provider

### Images Not Loading
- Verify URLs use production domain
- Check CORS settings in Supabase
- Confirm image files exist in `/public`
- Test image URLs directly in browser

## Security Checklist

- [ ] Environment variables marked as "Sensitive" where appropriate
- [ ] Database backups enabled in Supabase
- [ ] CORS properly configured
- [ ] SSL certificate configured (automatic)
- [ ] Rate limiting enabled on API routes
- [ ] RLS policies verified in database
- [ ] No sensitive data in client-side code
- [ ] Authentication tests passed

## Performance Optimization

- Vercel Analytics automatically enabled
- Next.js Image Optimization configured
- Static assets cached at edge
- Database query optimization reviewed
- API response times monitored
