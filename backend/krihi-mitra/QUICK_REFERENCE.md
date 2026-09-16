# Quick Reference & Testing Guide - AI Krishi Complete

## 🚀 Quick Start Testing

### 1. Test Krishi Mitra Chat (5 minutes)
```
1. Go to http://localhost:3000/mitra
2. See 4 suggestion cards
3. Click "Crop Care" or any suggestion
4. Wait for AI response (should see "..." streaming)
5. Response should appear in 2-5 seconds
6. Try typing your own question
7. Should get farming-related answer
```

**Expected:** Real AI responses, personalized to profile
**If error:** Check GOOGLE_GENERATIVE_AI_API_KEY in .env

---

### 2. Test Crop Scanner (5 minutes)
```
SCENARIO A: Upload a Crop Image
1. Go to http://localhost:3000/crop-scanner
2. Click "Upload Photo" or "Take Photo"
3. Select any crop/plant image
4. Click "Analyze Crop"
5. Should see analysis with:
   - Crop type
   - Health status
   - Disease (if any)
   - Treatments
   - Prevention

SCENARIO B: Upload Non-Crop Image
1. Same steps but upload: dog, car, building, or person
2. Should show error: "This image does not contain a crop plant"
3. Button to "Try Another Image"
```

**Expected:** Proper crop detection + analysis
**If error:** Check image quality or file size (<20MB)

---

### 3. Test Weather (2 minutes)
```
1. Go to http://localhost:3000/weather
2. Should show:
   - Current temperature
   - Humidity %
   - Wind speed
   - Location name
   - 7-day forecast
3. Data updates every 10 minutes
```

**Expected:** Real weather data or dummy data
**If error:** Check OPENWEATHER_API_KEY (will use fallback)

---

### 4. Test Theme Toggle (1 minute)
```
1. Any page in the app
2. Click Moon icon (top right)
3. Page turns dark
4. Click Sun icon
5. Page turns light
6. Reload page - theme persists
```

**Expected:** Instant theme switching, preference saved
**If issue:** Check theme-provider.tsx

---

### 5. Test Language Toggle (1 minute)
```
1. Any page in the app
2. Click "English" button (top right)
3. Interface should show Hindi text
4. Click "हिन्दी" button again
5. Back to English
6. Reload - language persists
```

**Expected:** Interface in selected language
**If issue:** Check translations.ts

---

### 6. Test Bottom Navigation (2 minutes)
```
1. Go to http://localhost:3000/dashboard
2. See bottom nav with 5 buttons:
   - 🏠 Home → /dashboard
   - 📸 Scan → /crop-scanner (NEW)
   - 🌤️ Weather → /weather
   - 💹 Mandi → /mandi
   - 🔔 Alerts → /alerts
3. Click each to verify routing
```

**Expected:** All buttons work, correct paths
**If issue:** Check bottom-nav.tsx

---

## 🔧 Environment Variables Checklist

```bash
# Required for AI features
GOOGLE_GENERATIVE_AI_API_KEY=sk-xxx...

# Required for weather
OPENWEATHER_API_KEY=xxx...

# Required for database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx...
```

✅ If missing, fallback dummy data will show instead
❌ Chat/Scanner/Weather will show errors if keys missing

---

## 📊 Testing Checklist

| Feature | Test | Expected Result | Status |
|---------|------|-----------------|--------|
| **Krishi Mitra** | Type question | AI response in 2-5s | ⭕ |
| **Crop Scanner** | Upload crop | Analysis with treatments | ⭕ |
| **Crop Scanner** | Upload non-crop | Error message | ⭕ |
| **Weather** | View page | Current temp + forecast | ⭕ |
| **Theme** | Toggle dark/light | Instant switching | ⭕ |
| **Language** | Toggle English/Hindi | Text changes | ⭕ |
| **Bottom Nav** | Click each button | Correct routing | ⭕ |
| **Alerts** | View page | Shows 4-5 alerts | ⭕ |
| **Mandi** | View page | Shows multi-crop prices | ⭕ |

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Chat shows error | Missing API key | Add GOOGLE_GENERATIVE_AI_API_KEY |
| Crop scan hangs | Image too large | Reduce to <20MB |
| Weather shows 401 | Invalid key | Check OPENWEATHER_API_KEY |
| Non-crop image not detected | Image unclear | Try clearer photo |
| Theme not persisting | localStorage issue | Clear cache, reload |
| Language not persisting | Context issue | Check language-provider |
| Navigation link broken | Wrong path | Verify bottom-nav.tsx |

---

## 📱 Mobile Testing

**Devices to test on:**
- iPhone 12/13/14
- Android phone (Samsung, Pixel)
- Tablet (iPad, Android tablet)
- Desktop (1920px, 1440px, 1366px)

**Mobile-specific checks:**
- Buttons/text readable
- Images load fast
- Camera capture works
- Bottom nav accessible
- Dark mode comfortable

---

## 🚀 Deployment Pre-Checklist

Before pushing to production:

```
✅ All environment variables set
✅ Krishi Mitra chat working
✅ Crop scanner analyzing correctly
✅ Weather displaying data
✅ Theme toggle working
✅ Language toggle working
✅ Mobile responsive
✅ No console errors
✅ Database connected
✅ Auth flow complete
✅ Navigation working
✅ Images loading
```

---

## 📞 Support Commands

**Reset cache:**
```bash
rm -rf .next
npm run build
```

**Check logs:**
```bash
tail -f /vercel/share/v0-project/logs/app.log
```

**Clear localStorage:**
```javascript
// Run in browser console
localStorage.clear()
location.reload()
```

**Test API directly:**
```bash
# Test Mitra API
curl -X POST http://localhost:3000/api/mitra \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'

# Test Crop Scanner API
curl -X POST http://localhost:3000/api/crop-scanner \
  -H "Content-Type: application/json" \
  -d '{"imageBase64":"xxx","mimeType":"image/jpeg"}'
```

---

**Last Updated:** May 3, 2026  
**All Features:** ✅ Ready for Testing

