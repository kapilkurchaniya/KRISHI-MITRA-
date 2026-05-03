# Image Enhancements - AI Krishi

## Overview
Added comprehensive image support across the AI Krishi farming app for visual engagement and better user experience on mobile devices.

## Images Added

### 1. Landing Page (Hero Section)
**File:** `/app/page.tsx`
- Changed hero image to use placeholder: `/placeholder.svg?height=400&width=300`
- Mobile-optimized 4:5 aspect ratio
- Falls back gracefully if image unavailable
- **Original Path:** `/farmer-in-green-paddy-field-using-smartphone-with-co.jpg`

### 2. Profile Avatar Support
**File:** `/app/(dashboard)/profile/page.tsx`
- Added avatar image display when `profile.avatar_url` exists
- Falls back to letter avatar if no image provided
- Supports any image format (jpg, png, webp)
- Properly handles missing images with accessibility

### 3. Scanner Image Preview
**File:** `/app/(dashboard)/scanner/capture/page.tsx`
- Shows full preview of captured/selected plant images
- Uses native `<img>` with proper object-cover for aspect preservation
- Falls back to placeholder if preview unavailable

### 4. Scan Result Images
**File:** `/app/(dashboard)/scanner/result/page.tsx`
- Displays the scanned plant image for diagnosis
- Shows full square aspect (aspect-square)
- Falls back to placeholder if scan image missing
- Properly labeled with alt text for accessibility

### 5. Scan History Thumbnails
**File:** `/app/(dashboard)/scanner/_components/scan-history-list.tsx`
- Shows thumbnail previews of past scans
- Size: 48x48px rounded (size-12)
- Fallback icon when no image available
- Perfect for quick visual history browsing

## Placeholder Assets Created

Created placeholder SVG files in `/public/` for development:
- `placeholder-farmer.svg` - For hero/farmer imagery
- `placeholder-crop.svg` - For crop-related content
- `placeholder-mandi.svg` - For market/mandi content
- `placeholder-weather.svg` - For weather visuals

## Pages with Image Support

| Page | Image Type | Location | Status |
|------|-----------|----------|--------|
| Landing | Hero farmer | `/` | ✓ Placeholder |
| Profile | User avatar | `/profile` | ✓ Optional upload |
| Scanner (Capture) | Plant photo | `/scanner/capture` | ✓ User upload |
| Scanner (Result) | Scan analysis | `/scanner/result?id=` | ✓ Auto-saved |
| Scan History | Thumbnails | `/scanner` | ✓ Auto-generated |
| Weather | Icons only | `/weather` | ✓ Icon-based |
| Mandi | Icons only | `/mandi` | ✓ Icon-based |
| Alerts | Icons only | `/alerts` | ✓ Icon-based |
| Download | Icons only | `/download` | ✓ Icon-based |

## Implementation Details

### Image Best Practices Applied
1. **Responsive Images**
   - Mobile-first approach
   - Proper aspect ratios (4:5, 1:1, thumbnail)
   - CSS `object-cover` for consistent display

2. **Fallback Strategy**
   - Placeholder SVGs for missing images
   - Icon-based fallbacks where appropriate
   - Letter avatars for user profiles

3. **Performance**
   - SVG placeholders (ultra-lightweight)
   - Image lazy loading via native browser
   - Proper alt text for all images

4. **Accessibility**
   - Descriptive alt text for all images
   - Semantic HTML with `<img>` tags
   - Aria labels where necessary

### Database Schema
The `profiles` table supports avatar_url:
```sql
avatar_url: text | null  -- User profile picture
```

The `scans` table stores images:
```sql
image_url: text  -- Captured/analyzed plant image
```

## Image Recommendations

### For Production Deployment
1. **Upload System**
   - Use Vercel Blob for profile avatars
   - Store scan images in Supabase storage
   - Implement image compression

2. **Hero Image**
   - Replace placeholder with actual farmer photo
   - Optimize for mobile (WebP format)
   - CDN-hosted for performance

3. **Weather Icons**
   - Consider weather-specific icons library
   - Dynamic rendering based on conditions
   - SVG or PNG format

4. **Crop Images**
   - Maintain database of crop photos
   - Disease-specific reference images
   - User-contributed photos for community

## Image URLs Structure

```
Landing Hero:    /placeholder.svg?height=400&width=300
Avatars:         /profiles/{user_id}/avatar.{ext}
Scan Images:     /scans/{scan_id}/image.{ext}
Placeholders:    /placeholder-{type}.svg
```

## Future Enhancements

- [ ] Implement Vercel Blob for avatar uploads
- [ ] Add image compression library
- [ ] Create crop/disease reference database
- [ ] Support for multiple weather icon sets
- [ ] Image gallery for past scans
- [ ] Before/after crop treatment photos
- [ ] Community contributed crop photos

## Testing Images

To test image functionality:

1. **Avatar Upload**: Update profile and see avatar change
2. **Scanner**: Take photo and verify preview displays
3. **Result**: Scan completes and result image shows
4. **History**: Multiple scans show thumbnail previews
5. **Fallbacks**: Disable images to verify placeholders work

## Notes

- All image references use proper alt text for SEO and accessibility
- Mobile viewport ensures images scale correctly
- Fallback system ensures app works even if image CDN is unavailable
- Avatar support can be enabled with Vercel Blob integration
