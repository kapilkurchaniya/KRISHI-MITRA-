## Supabase Email Verification Configuration

### 1. Enable Email Confirmation in Supabase Dashboard

Go to your Supabase project:
1. Navigate to **Authentication** → **Providers**
2. Click **Email** provider
3. Enable **Confirm email** toggle
4. Set email confirmation expiry to **24 hours**

### 2. Configure SMTP (Custom Email Sender)

#### Option A: SendGrid (Recommended)
1. Get SendGrid API key from https://app.sendgrid.com/settings/api_keys
2. In Supabase:
   - Go to **Authentication** → **Email Templates**
   - Click **SMTP Settings**
   - Provider: **SendGrid**
   - API Key: `SG.xxxxx`
   - From Email: `noreply@aikrishi.farm`
   - From Name: `AI Krishi`

#### Option B: AWS SES
1. Verify domain in AWS SES
2. Get SMTP credentials from AWS Console
3. Add to Supabase SMTP Settings:
   - Host: `email-smtp.region.amazonaws.com`
   - Port: `587`
   - Username & Password from AWS
   - From Email: verified sender email

#### Option C: Mailgun
1. Get Mailgun API credentials
2. In Supabase SMTP:
   - Host: `smtp.mailgun.org`
   - Port: `587`
   - Username: `postmaster@yourdomain.mailgun.org`
   - Password: Mailgun API key

### 3. Set Redirect URLs

In Supabase **Authentication** → **URL Configuration**:
```
Site URL: https://yourdomain.com
Redirect URLs:
- https://yourdomain.com/auth/callback
- https://yourdomain.com/profile-setup
- https://yourdomain.com/auth/error
```

### 4. Customize Email Templates

1. Go to **Authentication** → **Email Templates**
2. Click **Confirm signup** template
3. Customize HTML with your branding
4. Verify {{.ConfirmationURL}} is included

### 5. Environment Variables

Add to `.env.production`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://yourdomain.com/auth/callback
```

### 6. Testing Email Verification

1. Sign up with a test email
2. Check email inbox
3. Click confirmation link
4. Should redirect to profile-setup
5. Form auto-fills with metadata

### Troubleshooting

**Email not received:**
- Check Supabase SMTP settings
- Verify domain reputation
- Check spam folder
- Review SMTP logs in Supabase

**Confirmation link expired:**
- Token valid for 24 hours by default
- Increase expiry in Authentication settings
- User can request new email from login

**Redirect loop:**
- Verify redirect URLs match exactly
- Check for localhost references
- Ensure NEXT_PUBLIC env vars are set
- Clear browser cache

### Production Checklist

- [ ] SMTP provider configured (SendGrid/SES/Mailgun)
- [ ] Redirect URLs set correctly
- [ ] Email templates customized
- [ ] Test signup flow end-to-end
- [ ] Verify emails sent within 1 minute
- [ ] Check spam/bounce rates
- [ ] Monitor email delivery in provider dashboard
