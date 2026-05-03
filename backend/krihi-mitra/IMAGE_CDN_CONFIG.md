# Image Hosting & CDN Configuration

## Current Setup

AI Krishi uses relative URLs for all static images from the `/public` folder:
- `/placeholder.svg` - Feature showcase images
- `/icon.svg` - App icon
- `/manifest.webmanifest` - PWA manifest file

These are automatically served from your production domain when deployed to Vercel.

## Public Image URLs in Production

### Relative URLs (Automatic)
```
/placeholder.svg → https://yourdomain.com/placeholder.svg
/icon.svg → https://yourdomain.com/icon.svg
```

### App Features Using Images
1. **Landing Page** (`/`)
   - Hero section: `/placeholder.svg` (4:5 aspect ratio)
   - Feature gallery: 3x `/placeholder.svg` images
   - All load from production domain automatically

2. **User Avatars** (`/profile`)
   - Optional: `profile.avatar_url` (dynamic)
   - Fallback: Letter avatar generated

3. **Scanner Results** (`/scanner/result`)
   - `scan.image_url` - User uploaded plant photo
   - Fallback: `/placeholder.svg`

## Option 1: Vercel Blob (Recommended)

**Best for:** User-uploaded images, profile pictures

### Setup
1. Enable Vercel Blob in Vercel project settings
2. Get BLOB_READ_WRITE_TOKEN from settings
3. Add to environment variables

### Usage in Code
```typescript
// Upload image
const blob = await put(fileName, file, { access: 'public' });
const url = blob.url; // https://your-blob-url.vercel-storage.com/path

// Store URL in database
await supabase.from('profiles').update({ avatar_url: url }).eq('id', user.id);

// Display image
<img src={profile.avatar_url} alt="Avatar" />
```

### Implementation Example
```typescript
// app/(dashboard)/profile/_components/profile-form.tsx
import { put } from '@vercel/blob';

async function uploadAvatar(file: File) {
  const blob = await put(`avatars/${user.id}/${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}
```

## Option 2: Supabase Storage

**Best for:** Private & public files, user documents

### Setup
1. Create bucket in Supabase: `avatars` (public access)
2. Enable CORS if needed
3. Store URLs in profiles table

### Usage
```typescript
// Upload
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${user.id}/avatar.jpg`, file);

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl(`${user.id}/avatar.jpg`);

// URL format
// https://projectid.supabase.co/storage/v1/object/public/avatars/user-id/avatar.jpg
```

## Option 3: AWS S3 + CloudFront

**Best for:** High-volume, enterprise setup

### Setup
1. Create S3 bucket
2. Set up CloudFront distribution
3. Configure CORS headers
4. Add AWS credentials to environment

### Usage
```typescript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const url = `https://${process.env.CLOUDFRONT_DOMAIN}/avatars/${filename}`;
```

## Option 4: Third-party Image Service

**Best for:** Image optimization & CDN**

Services:
- Cloudinary - https://cloudinary.com
- ImgIX - https://imgix.com
- Akamai - https://www.akamai.com

### Setup
```typescript
// Use Cloudinary
const cloudinaryUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/v${timestamp}/${filename}`;
```

## Current Implementation

### Static Assets
All files in `/public` folder are automatically served as:
```
https://yourdomain.com/filename
```

### Dynamic User Images
Currently handled by:
- `scan.image_url` - Database field storing uploaded image path
- `profile.avatar_url` - Optional avatar URL
- Both default to `/placeholder.svg` if not set

### Migration Path
1. Deploy current setup (uses `/public` for static assets)
2. Add Vercel Blob for user uploads
3. Update database schema if needed
4. Implement file upload UI

## Security & Performance

### Static Images
- Cached at Vercel Edge (automatically)
- No authentication needed
- Optimal performance globally

### User Images
- Use CORS-enabled CDN
- Add authentication if private content
- Implement CDN caching headers
- Use responsive image formats

### Best Practices
```typescript
// Always include alt text
<img src={url} alt="Descriptive text" />

// Use placeholder while loading
<img src={url} alt="..." loading="lazy" />

// Responsive sizing
className="w-full h-auto"

// Error handling
onError={() => setImageUrl('/placeholder.svg')}
```

## Verifying Production Setup

### Test Static Images
```bash
curl -I https://yourdomain.com/placeholder.svg
# Should return 200 OK
```

### Test Dynamic Images
```bash
# After uploading avatar, verify URL works
curl -I https://yourdomain.com/user-avatar.jpg
```

### Check CORS Headers
```bash
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: GET" \
  https://your-cdn.com/image.jpg
```

## Troubleshooting

### Images 404 Not Found
- Verify image exists in `/public` folder
- Check image filename exactly (case-sensitive)
- Ensure production domain is correct

### Images Load Slow
- Images cached at Edge (check cache headers)
- Consider image optimization service
- Use responsive image formats (WebP)

### CORS Errors
- Add CDN domain to CORS whitelist
- Configure Access-Control headers
- Test from production domain only

### Mixed Content Error (HTTPS)
- Ensure all image URLs use HTTPS
- Update image URLs from HTTP to HTTPS
- Check browser console for warnings

## Implementation Checklist

- [ ] All static images in `/public` folder
- [ ] Image URLs use production domain (no localhost)
- [ ] Alt text added to all images
- [ ] Placeholder images fallback configured
- [ ] CDN selected for user uploads
- [ ] Database schema updated if needed
- [ ] CORS configured if using external CDN
- [ ] Images tested on production domain
- [ ] Performance monitoring enabled
- [ ] Backup strategy implemented
