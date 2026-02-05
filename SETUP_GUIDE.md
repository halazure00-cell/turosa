# Panduan Setup Lengkap - Turosa

Dokumen ini memberikan panduan lengkap untuk mengatasi masalah "Invalid Key" saat upload PDF dan konfigurasi sistem secara keseluruhan.

## 🔍 Masalah: Upload PDF Gagal dengan Error "Invalid Key"

### Penyebab Masalah

Error "invalid key" terjadi karena aplikasi tidak dapat terhubung ke Supabase storage. Ini disebabkan oleh:

1. **Environment variables tidak dikonfigurasi** - Variabel `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` tidak diset
2. **Credentials tidak valid** - API key atau URL Supabase yang digunakan salah atau sudah kadaluarsa
3. **Supabase project belum dibuat** - Belum ada project Supabase yang aktif
4. **Storage bucket belum dikonfigurasi** - Bucket `book-files` dan `book-covers` belum dibuat di Supabase

### Gejala yang Terlihat

- ❌ Upload PDF gagal total
- ❌ Muncul pesan error "invalid key" atau "Invalid API key"
- ❌ Proses upload tidak menunjukkan progress
- ❌ Console browser menampilkan error terkait Supabase authentication

## ✅ Solusi Lengkap

### Langkah 1: Setup Supabase Project

1. **Buat Account Supabase**
   - Kunjungi [https://supabase.com](https://supabase.com)
   - Klik "Start your project"
   - Daftar menggunakan GitHub atau email

2. **Buat Project Baru**
   - Klik "New Project"
   - Pilih organization (atau buat baru)
   - Isi detail project:
     - Name: `turosa` (atau nama lain)
     - Database Password: Buat password yang kuat (simpan dengan aman!)
     - Region: Pilih Singapore untuk performa terbaik di Indonesia
   - Klik "Create new project"
   - Tunggu ~2 menit hingga project selesai di-setup

3. **Dapatkan Credentials**
   - Setelah project siap, buka **Settings** → **API**
   - Catat informasi berikut:
     - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
     - **Anon/Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Langkah 2: Setup Storage Buckets

1. **Buka Storage di Dashboard Supabase**
   - Navigasi ke **Storage** di sidebar

2. **Buat Bucket untuk Cover Images**
   - Klik "New bucket"
   - Name: `book-covers`
   - Public bucket: **✅ Centang** (Ya, bucket ini public)
   - Klik "Create bucket"

3. **Buat Bucket untuk PDF Files**
   - Klik "New bucket" lagi
   - Name: `book-files`
   - Public bucket: **❌ Jangan centang** (Bucket ini private)
   - Klik "Create bucket"

4. **Setup Storage Policies** (Penting!)
   
   Buka **Storage** → **Policies** dan tambahkan policy berikut:
   
   **Untuk bucket `book-covers`:**
   ```sql
   -- Policy: Public Access Covers
   CREATE POLICY "Public Access Covers"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'book-covers' );

   -- Policy: Auth Users Upload Covers
   CREATE POLICY "Auth Users Upload Covers"
   ON storage.objects FOR INSERT
   WITH CHECK ( bucket_id = 'book-covers' AND auth.role() = 'authenticated' );
   ```

   **Untuk bucket `book-files`:**
   ```sql
   -- Policy: Auth Users Select Files
   CREATE POLICY "Auth Users Select Files"
   ON storage.objects FOR SELECT
   USING ( bucket_id = 'book-files' AND auth.role() = 'authenticated' );

   -- Policy: Auth Users Upload Files
   CREATE POLICY "Auth Users Upload Files"
   ON storage.objects FOR INSERT
   WITH CHECK ( bucket_id = 'book-files' AND auth.role() = 'authenticated' );
   ```

   Atau lebih mudah, jalankan migration yang sudah ada:
   - Buka **SQL Editor** di Supabase Dashboard
   - Copy isi file `supabase/migrations/20240206_storage.sql`
   - Paste dan jalankan SQL tersebut

### Langkah 3: Setup Database Tables

1. **Jalankan Database Migrations**
   - Buka **SQL Editor** di Supabase Dashboard
   - Jalankan migration files secara berurutan:
     1. `supabase/migrations/20240203000000_initial_schema.sql`
     2. `supabase/migrations/20240205_init.sql`
     3. `supabase/migrations/20240206_storage.sql`
     4. `supabase/migrations/20240210_add_category_and_constraints.sql`

### Langkah 4: Konfigurasi Environment Variables

#### Development (Lokal)

1. **Copy file template**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit file `.env.local`** dan isi dengan credentials dari Supabase:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   # OpenAI API (for AI chat and quiz generation)
   OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

   # Google Cloud Vision API (for OCR)
   GOOGLE_CLIENT_EMAIL=your-service-account@project-id.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----"
   GOOGLE_PROJECT_ID=your-google-cloud-project-id
   ```

3. **Restart development server**
   ```bash
   npm run dev
   ```

#### Production (Vercel)

1. **Login ke Vercel Dashboard**
   - Buka [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **Pilih project Turosa**

3. **Buka Settings → Environment Variables**

4. **Tambahkan variabel satu per satu:**
   - Klik "Add New"
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: URL dari Supabase
   - Environment: Production, Preview, Development (pilih semua)
   - Klik "Save"
   
   - Ulangi untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Redeploy aplikasi**
   - Buka tab "Deployments"
   - Klik menu (3 dots) pada deployment terakhir
   - Pilih "Redeploy"

### Langkah 5: Verifikasi Setup

1. **Cek Console Browser**
   - Buka aplikasi di browser
   - Tekan F12 untuk membuka DevTools
   - Lihat tab Console
   - Tidak boleh ada error "Supabase credentials not configured"

2. **Test Upload**
   - Login ke aplikasi
   - Buka halaman Upload (`/upload`)
   - Periksa apakah ada pesan error konfigurasi di bagian atas form
   - Jika tidak ada, artinya konfigurasi sudah benar

3. **Test Upload PDF**
   - Pilih file PDF
   - Isi informasi kitab
   - Klik "Upload Kitab"
   - Upload harus berhasil tanpa error "invalid key"

## 🔧 Troubleshooting

### Problem 1: Masih muncul "Invalid Key" setelah setup

**Kemungkinan Penyebab:**
- Environment variables belum ter-load
- Credentials yang dimasukkan salah

**Solusi:**
1. **Verifikasi environment variables sudah benar:**
   ```bash
   # Di terminal, jalankan:
   node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
   node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)"
   ```
   Kedua command harus menampilkan nilai, bukan `undefined`

2. **Restart development server dengan clear cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Di Vercel, pastikan redeploy setelah set environment variables**

### Problem 2: Error "row-level security policy"

**Penyebab:**
Storage policies belum dikonfigurasi dengan benar

**Solusi:**
1. Buka Supabase Dashboard → Storage → Policies
2. Pastikan semua 4 policies sudah ada (2 untuk book-covers, 2 untuk book-files)
3. Jika belum ada, jalankan SQL dari `supabase/migrations/20240206_storage.sql`

### Problem 3: Upload berhasil tapi file tidak bisa diakses

**Penyebab:**
- Bucket `book-files` tidak memiliki SELECT policy
- User belum authenticated

**Solusi:**
1. Pastikan user sudah login
2. Verifikasi policy "Auth Users Select Files" sudah ada
3. Cek signed URL yang di-generate sudah benar

### Problem 4: Error di production tapi di development berjalan normal

**Penyebab:**
Environment variables di Vercel belum diset atau salah

**Solusi:**
1. Login ke Vercel Dashboard
2. Buka project → Settings → Environment Variables
3. Pastikan semua variable ada untuk environment "Production"
4. Klik "Redeploy" setelah update

### Problem 5: Upload lambat atau timeout

**Penyebab:**
- File PDF terlalu besar
- Region Supabase jauh dari lokasi user

**Solusi:**
1. Batasi ukuran file maksimal (sudah ada: 50MB)
2. Gunakan region Supabase terdekat (Singapore untuk Indonesia)
3. Implementasi upload dengan chunking untuk file besar

## 📋 Checklist Setup

Gunakan checklist ini untuk memastikan semua sudah dikonfigurasi:

### Supabase Setup
- [ ] Project Supabase sudah dibuat
- [ ] Credentials (URL & Anon Key) sudah dicatat
- [ ] Bucket `book-covers` (public) sudah dibuat
- [ ] Bucket `book-files` (private) sudah dibuat
- [ ] Storage policies sudah dikonfigurasi (4 policies)
- [ ] Database migrations sudah dijalankan

### Environment Variables
- [ ] File `.env.local` sudah dibuat (development)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` sudah diisi
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah diisi
- [ ] Environment variables di Vercel sudah diset (production)

### Verification
- [ ] Development server berjalan tanpa warning
- [ ] Tidak ada error "Supabase credentials not configured" di console
- [ ] Halaman upload tidak menampilkan pesan error konfigurasi
- [ ] Test upload PDF berhasil
- [ ] File ter-upload bisa diakses di library

## 🎯 Best Practices

1. **Keamanan Credentials**
   - Jangan commit file `.env.local` ke git
   - Gunakan environment variables untuk semua credentials
   - Rotate API keys secara berkala

2. **Monitoring**
   - Monitor Supabase Dashboard untuk usage dan errors
   - Setup alerts untuk quota usage
   - Review logs secara berkala

3. **Backup**
   - Backup database secara berkala
   - Export files dari storage bucket
   - Simpan migration files dengan baik

4. **Performance**
   - Gunakan CDN untuk file statis
   - Implementasi caching untuk frequently accessed files
   - Optimize file size sebelum upload

## 📞 Dukungan

Jika masih mengalami masalah setelah mengikuti panduan ini:

1. Cek console browser untuk error messages detail
2. Review Supabase logs di Dashboard → Logs
3. Verifikasi semua checklist sudah complete
4. Buka issue di repository GitHub dengan detail error

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Deployment Guide](./DEPLOYMENT.md)

---

**Terakhir diupdate**: 2026-02-05
**Status**: ✅ Comprehensive Setup Guide
