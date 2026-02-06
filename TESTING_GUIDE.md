# Testing Guide - Turosa

Panduan lengkap untuk testing aplikasi Turosa sebelum deployment.

## 📋 Pre-Deployment Testing Checklist

### 1. Environment Setup
```bash
# Verifikasi environment variables
npm run test:setup

# Output yang diharapkan:
# ✅ [PASS] NEXT_PUBLIC_SUPABASE_URL configured
# ✅ [PASS] NEXT_PUBLIC_SUPABASE_ANON_KEY configured
# ✅ [PASS] Supabase connection successful
```

### 2. Database Verification
```bash
# Cek database schema
npm run verify:database

# Output yang diharapkan:
# ✅ Table 'books' exists and is accessible
# ✅ Table 'chapters' exists and is accessible
# ✅ Table 'user_progress' exists and is accessible
# ✅ Table 'discussions' exists and is accessible
# ✅ Table 'profiles' exists and is accessible
```

### 3. Storage Setup
```bash
# Panduan setup storage buckets
npm run setup:storage

# Ikuti instruksi untuk:
# - Membuat bucket 'book-covers' (public)
# - Membuat bucket 'book-files' (private dengan RLS)
```

## 🧪 Manual Testing Procedures

### Test 1: Authentication Flow
1. **Signup**
   - [ ] Navigate to `/auth/signup`
   - [ ] Enter email and password (min 6 karakter)
   - [ ] Verify email validation works
   - [ ] Submit form
   - [ ] Check email for verification link (if enabled)
   - [ ] Verify redirect to dashboard

2. **Login**
   - [ ] Navigate to `/auth/login`
   - [ ] Enter credentials
   - [ ] Verify successful login
   - [ ] Check session persistence

3. **Logout**
   - [ ] Click logout button
   - [ ] Verify redirect to home page
   - [ ] Check protected routes redirect to login

### Test 2: Upload Flow
1. **Navigate to Upload Page**
   - [ ] Go to `/upload`
   - [ ] Verify page loads without errors
   - [ ] Check configuration status indicator

2. **File Selection**
   - [ ] Select cover image (test with valid JPEG/PNG < 5MB)
   - [ ] Select PDF file (test with valid PDF < 50MB)
   - [ ] Verify file names display correctly

3. **Form Validation**
   - [ ] Try submit without title → Should show error
   - [ ] Try submit without PDF → Should show error
   - [ ] Try submit with PDF > 50MB → Should show error
   - [ ] Try submit with cover > 5MB → Should show error

4. **Successful Upload**
   - [ ] Fill all required fields
   - [ ] Click upload button
   - [ ] Verify upload progress indication
   - [ ] Check success message appears
   - [ ] Verify redirect to library or dashboard

### Test 3: Library & Reading Flow
1. **Library Page**
   - [ ] Navigate to `/library`
   - [ ] Verify books display in grid/list view
   - [ ] Test search functionality
   - [ ] Test pagination (if > 12 books)
   - [ ] Click on a book

2. **Reader Page**
   - [ ] Verify PDF loads correctly
   - [ ] Test PDF controls (zoom, page navigation)
   - [ ] Check chapter list (if book is digitized)
   - [ ] Verify progress tracking works

### Test 4: Digitization (OCR) Flow
1. **Start Digitization**
   - [ ] Navigate to book details
   - [ ] Click "Digitize" button
   - [ ] Upload page image
   - [ ] Verify Tesseract.js loads and processes image

2. **Verify Results**
   - [ ] Check extracted Arabic text displays correctly
   - [ ] Verify ability to edit text
   - [ ] Test with different image qualities
   - [ ] Save as chapter
   - [ ] Verify chapter appears in book

### Test 5: AI Chat & Discussion
1. **AI Chat (Ollama)**
   - [ ] Navigate to digitized chapter
   - [ ] Click "Tanya Ustadz Turosa" button
   - [ ] Ask a question about the text
   - [ ] Verify Ollama responds correctly
   - [ ] Check response quality and relevance

2. **Discussions**
   - [ ] Navigate to book/chapter
   - [ ] Create new discussion thread
   - [ ] Add comments
   - [ ] Verify threading works

## 🔍 Common Failure Scenarios & Fixes

### Scenario 1: Upload Fails with "Invalid API key"
**Symptom:** Error message saat upload: "Konfigurasi API tidak valid"

**Diagnosis:**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Fix:**
1. Verify `.env.local` exists dan terisi
2. Restart development server: `npm run dev`
3. Clear browser cache
4. Re-check Supabase dashboard for correct keys

### Scenario 2: Storage Bucket Not Found
**Symptom:** Error: "Bucket not found" saat upload

**Fix:**
1. Login ke Supabase Dashboard
2. Go to Storage section
3. Create buckets:
   - `book-covers` (public)
   - `book-files` (private)
4. Set RLS policies untuk authenticated users

### Scenario 3: Database Table Missing
**Symptom:** Error mentioning "relation does not exist"

**Fix:**
```bash
# Check migrations
cd supabase/migrations
ls -la

# Run migrations via Supabase CLI or Dashboard
```

### Scenario 4: PDF Not Loading
**Symptom:** PDF viewer shows blank atau error

**Possible Causes:**
1. Signed URL expired (> 1 year)
2. RLS policy blocking access
3. File corrupted during upload

**Fix:**
1. Check browser console for errors
2. Verify RLS policies allow authenticated users
3. Re-upload the PDF file
4. Check PDF file integrity locally

### Scenario 5: OCR Not Working
**Symptom:** "OCR unavailable" atau no text extracted

**Diagnosis:**
1. Check browser console for Tesseract.js errors
2. Verify image quality and format

**Fix:**
1. Ensure image is clear and high-resolution
2. Try with a different image format (JPEG, PNG)
3. Check browser compatibility with Tesseract.js
4. Verify image contains Arabic text
5. Clear browser cache and reload

## 📊 Performance Benchmarks

### Upload Performance
- PDF < 10MB: Should complete in < 30 seconds
- PDF 10-50MB: Should complete in < 2 minutes
- Cover image: Should complete in < 10 seconds

### Page Load Times
- Home page: < 2 seconds
- Library page: < 3 seconds
- Reader page: < 5 seconds (depends on PDF size)

### Database Query Performance
- List books (12 items): < 500ms
- Get single book: < 200ms
- Search books: < 1 second

## 🔐 Security Testing

### Check List
- [ ] Verify RLS policies prevent unauthorized access
- [ ] Test that users can only edit their own data
- [ ] Verify file upload size limits enforced
- [ ] Test SQL injection prevention
- [ ] Verify XSS protection
- [ ] Check CSRF protection

### Testing RLS Policies
```sql
-- Test as anonymous user (should fail)
SELECT * FROM books WHERE uploader_id != auth.uid();

-- Test as authenticated user (should succeed)
SELECT * FROM books WHERE uploader_id = auth.uid();
```

## 🚀 Automated Testing (Future)

### Unit Tests (Planned)
```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage
```

### Integration Tests (Planned)
```bash
# Run integration tests
npm run test:integration
```

### E2E Tests (Planned)
```bash
# Run E2E tests with Playwright
npm run test:e2e
```

## 📝 Testing Workflow

### Before Each Deploy
1. Run `npm run test:setup` → All checks should pass
2. Run `npm run verify:database` → All tables accessible
3. Manually test upload flow with sample PDF
4. Verify health dashboard: `/admin/health`
5. Check browser console for errors
6. Test on mobile viewport
7. Run production build: `npm run build`
8. Test production build: `npm run start`

### After Deploy
1. Visit health endpoint: `https://your-domain.com/api/admin/health`
2. Test authentication flow
3. Test upload with real file
4. Monitor error logs
5. Check performance metrics

## 🐛 Debugging Tips

### Enable Debug Logging
Development mode automatically enables detailed console logs.

### Browser DevTools
1. Open Chrome DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Application tab for session storage

### Server Logs
```bash
# Development
npm run dev
# Watch console output for server-side errors

# Production (Vercel)
# Check Vercel Dashboard → Your Project → Logs
```

### Database Queries
Use Supabase Dashboard → Database → SQL Editor to run diagnostic queries:

```sql
-- Check uploaded books
SELECT * FROM books ORDER BY created_at DESC LIMIT 10;

-- Check user progress
SELECT * FROM user_progress WHERE user_id = 'USER_ID';

-- Check storage usage
SELECT COUNT(*) as total_books FROM books;
```

## ✅ Success Criteria

Upload flow is considered working if:
- ✅ User can successfully upload PDF and cover
- ✅ Files stored in Supabase Storage
- ✅ Book metadata saved to database
- ✅ Book appears in library page
- ✅ PDF opens in reader
- ✅ No console errors during process
- ✅ Upload completes in reasonable time

## 📞 Support

If testing reveals issues:
1. Check this guide for solutions
2. Review error logs
3. Check Supabase status page
4. Review GitHub issues
5. Contact support team

---

**Last Updated:** February 2026
**Version:** 1.0.0
