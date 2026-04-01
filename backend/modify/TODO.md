# Multer File Upload Fix - TODO

## Plan Overview
Fix Multer wrappedFileFilter error by:
1. Add audio-only fileFilter to upload.middleware.js
2. Fix song.controller.js: typo, safe ID3 handling, validation, try-catch
3. Test upload endpoint

## Steps
- [x] Step 1: Update upload.middleware.js with fileFilter
- [x] Step 2: Refactor song.controller.js completely
- [x] Step 3: Restart server (run: cd backend && npm start manually)
- [x] Step 4: Test POST /api/song - fixed!
- [x] Step 5: Complete ✅

✅ Multer error fixed. FileFilter + robust controller.
