# AI Krishi Production Deployment - Quick Start Guide

## 5-Minute Setup Summary

AI Krishi is fully configured for production deployment. This guide gets you live in minutes.

---

## Step 1: Deploy to Vercel (2 minutes)

**Push to GitHub & Deploy:**
```bash
git push origin main
```

Then on https://vercel.com:
1. Click "New Project"
2. Import GitHub repository
3. Click "Deploy"
4. Wait for build to complete

**Result:** App deployed at `*.vercel.app` domain

---

## Step 2: Configure Production Domain (1 minute)

**In Vercel Dashboard:**
1. Project Settings → Domains
2. Add your domain (e.g., `yourdomain.com`)
3. Follow DNS setup instructions

**DNS Update (varies by provider):**
- Add CNAME or A record pointing to Vercel
- Wait 5-30 minutes for propagation

---

## Step 3: Set Environment Variables (1 minute)

**In Vercel Dashboard → Settings → Environment Variables:**

Add these variables (copy from Supabase project):

| Variable | Value | Source |
|----------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase → Project Settings → API (mark Sensitive) |
| `SUPABASE_JWT_SECRET` | `super-secret...` | Supabase → Project Settings → JWT Settings (mark Sensitive) |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | `https://yourdomain.com/auth/callback` | Your production domain |

---

## Step 4: Configure Email Verification (1 minute)

**In Supabase Dashboard:**

1. **Enable Email Confirmation:**
   - Go to Authentication → Providers → Email
   - Toggle "Confirm email" ON

2. **Update URL Configuration:**
   - Go to Authentication → URL Configuration
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: `https://yourdomain.com/auth/callback`

3. **(Optional) Custom Email:**
   - Go to Authentication → SMTP Settings
   - Configure SendGrid, Mailgun, or AWS SES

---

## Step 5: Test Everything (Before going live)

### Test Email Verification:
```
1. Visit https://yourdomain.com
2. Click "Get started"
3. Fill form:
   - Name: Test Farmer
   - Email: your-test-email@gmail.com
   - Phone: +919876543210
   - Password: Test@12345
4. Click "Create account"
5. Check email for verification link
6. Click link → Should show profile setup page
7. Complete profile → Access dashboard
```

### Test Images Load:
```
1. Check homepage displays placeholder images
2. Verify feature gallery loads
3. Upload profile picture → Check displays
4. Use scanner → Check images load
5. Open DevTools → Check no console errors
```

### Verify No Localhost URLs:
```
1. Open DevTools → Network tab
2. Check all image URLs use yourdomain.com
3. Check all API calls use yourdomain.com
4. Verify no http://localhost URLs
```

---

## Production URLs Reference

### Static Images (Automatic)
```
https://yourdomain.com/placeholder.svg
https://yourdomain.com/icon.svg
https://yourdomain.com/manifest.webmanifest
https://yourdomain.com/icons/icon-192.svg
https://yourdomain.com/icons/icon-512.svg
```

### User Uploaded Images (Optional)
- Profile avatars: Supabase Storage or Vercel Blob
- Scan photos: Stored with scan record
- Recommendation: Use Vercel Blob for simplicity

### API Endpoints
```
https://yourdomain.com/api/weather?lat={lat}&lon={lon}
https://yourdomain.com/api/geocode?lat={lat}&lon={lon}
https://yourdomain.com/api/mandi?lat={lat}&lon={lon}
https://yourdomain.com/api/profile
https://yourdomain.com/api/contact
```

---

## Email Verification Flow Explained

**What Happens Behind the Scenes:**

1. **User Registration:**
   ```
   POST /auth/register
   Email: farmer@gmail.com
   Password: SecurePass123
   ```

2. **Supabase Processes:**
   ```
   ✓ Creates auth user
   ✓ Generates verification token
   ✓ Sends email with link:
     https://yourdomain.com/auth/callback?code=xyz123&type=signup
   ✓ Creates profile record (via trigger)
   ```

3. **User Clicks Email Link:**
   ```
   GET /auth/callback?code=xyz123
   ✓ Validates token
   ✓ Exchanges for session
   ✓ Redirects to /profile-setup
   ```

4. **User Completes Profile:**
   ```
   PATCH /api/profile
   Full Name, Phone, Location, etc.
   ✓ Profile saved
   ✓ Redirects to /dashboard
   ```

**Security:**
- Tokens valid for 24 hours only
- Email confirmation required (unless disabled in Supabase)
- Password never sent in URL
- Session stored securely in cookies

---

## Image Hosting Explained

**Why No Localhost?**
- Localhost only works on your computer
- Production users can't access localhost
- Must use public accessible URLs

**How Images Load in Production:**

1. **Static Images (in `/public` folder):**
   ```
   Request: https://yourdomain.com/placeholder.svg
   ↓
   Vercel serves from Edge Network
   ↓
   Cached globally for fast performance
   ↓
   Returns: Image data (CORS enabled)
   ```

2. **User Uploaded Images:**
   ```
   User uploads avatar
   ↓
   Stored in Supabase Storage / Vercel Blob
   ↓
   URL saved to database: https://cdn-url/avatar.jpg
   ↓
   App displays from public URL
   ↓
   Automatically cached by CDN
   ```

**Zero Configuration Needed:**
- All static images work automatically
- Vercel handles CDN caching
- SSL/HTTPS automatic
- Global edge network included

---

## Common Issues & Fixes

### "Email verification link doesn't work"
**Cause:** NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL not set
```
Fix:
1. In Vercel → Settings → Environment Variables
2. Add: NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://yourdomain.com/auth/callback
3. Redeploy
```

### "Email never arrives"
**Cause:** Supabase email not configured
```
Fix:
1. Check Supabase → Authentication → Email tab
2. Verify "Confirm email" is ON
3. Check spam folder
4. Wait 2-3 minutes (first emails may be slow)
5. Configure custom SMTP if needed
```

### "Images show 404 not found"
**Cause:** Image not in `/public` folder or localhost URL
```
Fix:
1. Check image exists in /public folder
2. Verify filename (case-sensitive)
3. Check browser console for URLs
4. Ensure URL uses yourdomain.com (not localhost)
```

### "Authentication keeps failing"
**Cause:** Environment variables missing or incorrect
```
Fix:
1. Verify all env vars in Vercel → Settings
2. Confirm values match Supabase project
3. Redeploy after changing vars
4. Check browser console for error details
5. Review Supabase auth logs
```

### "App crashes after deploy"
**Cause:** Build failed silently
```
Fix:
1. Check Vercel → Deployments → view logs
2. Verify environment variables are set
3. Check Supabase connection status
4. Rollback to previous deployment
5. Try deploying again
```

---

## Post-Deployment Checklist

**Immediately After Deploy:**
- [ ] App loads at production URL
- [ ] Images display correctly
- [ ] No console errors
- [ ] Email verification works
- [ ] User registration completes
- [ ] Dashboard accessible after login

**First Day:**
- [ ] Test with real user email
- [ ] Verify verification email arrives
- [ ] Check email link works
- [ ] Confirm profile setup saves
- [ ] Verify all dashboard features

**First Week:**
- [ ] Monitor error logs
- [ ] Check email delivery rate
- [ ] Test scanner functionality
- [ ] Verify weather data loads
- [ ] Check mandi prices update
- [ ] Monitor performance metrics

**Monthly:**
- [ ] Review analytics
- [ ] Check user feedback
- [ ] Update dependencies if needed
- [ ] Test backup restoration
- [ ] Review security logs

---

## Need Help?

### Documentation Files:
- `PRODUCTION_DEPLOYMENT.md` - Detailed setup guide
- `VERCEL_DEPLOYMENT.md` - Step-by-step Vercel setup
- `IMAGE_CDN_CONFIG.md` - Image hosting options
- `PRODUCTION_READY.md` - Full feature checklist

### Support Resources:
- Vercel Documentation: https://vercel.com/docs
- Supabase Documentation: https://supabase.com/docs
- GitHub Issues: Check project repository

### Debugging:
1. Check Vercel deployment logs
2. Review Supabase auth logs
3. Monitor browser console
4. Test with curl for API endpoints
5. Check network requests in DevTools

---

## What's Already Configured

✅ **Email Verification**
- Supabase Auth handles all email sending
- Confirmation links auto-generated
- Token validation automatic
- Profile auto-created on signup

✅ **Public Images**
- All static images in `/public` folder
- Automatically served from production domain
- Cached globally via Vercel Edge
- No configuration needed

✅ **Secure Configuration**
- Environment variables in Vercel
- Sensitive vars marked as Sensitive
- SSL/HTTPS automatic
- Database RLS enabled
- API authentication required

✅ **Production Ready**
- All routes working
- No localhost references
- Mobile optimized
- PWA with offline support
- API routes with error handling

---

## Ready to Go Live?

**You have everything needed:**
1. Email verification ✓
2. Public image hosting ✓
3. Secure authentication ✓
4. Production domain support ✓
5. Database with RLS ✓

**Next Steps:**
1. Deploy to Vercel
2. Add environment variables
3. Configure custom domain
4. Test email & images
5. Go live!

---

**Estimated Time to Production:** 15-30 minutes
**Support:** All documentation included in project repo
**Ready?** Deploy now! 🚀
