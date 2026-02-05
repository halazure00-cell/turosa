# Quick Fix - Upload PDF Error "Invalid Key"

## 🚨 Masalah: Upload PDF Gagal - "Invalid Key"

### Penyebab Utama
Environment variables Supabase belum dikonfigurasi.

### Solusi Cepat (5 Menit)

#### Langkah 1: Dapatkan Credentials Supabase
1. Login ke https://supabase.com
2. Buka project Anda (atau buat baru)
3. Klik **Settings** → **API**
4. Copy:
   - Project URL
   - Anon/public key

#### Langkah 2: Set Environment Variables

**Development (Lokal):**
```bash
# Buat file .env.local
cp .env.example .env.local

# Edit .env.local dan isi:
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Restart server
npm run dev
```

**Production (Vercel):**
1. Login ke Vercel Dashboard
2. Pilih project → Settings → Environment Variables
3. Tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klik **Redeploy**

#### Langkah 3: Setup Storage Buckets (PENTING!)
1. Buka Supabase Dashboard → **Storage**
2. Buat bucket `book-covers` (public)
3. Buat bucket `book-files` (private)
4. Buka **SQL Editor**, jalankan:
   ```sql
   -- Copy dari file: supabase/migrations/20240206_storage.sql
   -- dan jalankan di SQL Editor
   ```

### Verifikasi
- ✅ Tidak ada error di console browser
- ✅ Halaman upload tidak ada pesan error konfigurasi
- ✅ Upload PDF berhasil

### Masih Bermasalah?
Baca panduan lengkap: [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## Troubleshooting Cepat

### Error: "Supabase credentials not configured"
→ Environment variables belum diset. Ikuti Langkah 2 di atas.

### Error: "Invalid API key"
→ API key salah. Cek lagi di Supabase Dashboard → Settings → API.

### Error: "row-level security"
→ Storage policies belum diset. Ikuti Langkah 3 di atas.

### Upload lambat
→ Gunakan Supabase region Singapore untuk Indonesia.

---

**Butuh bantuan?** Lihat [SETUP_GUIDE.md](SETUP_GUIDE.md) untuk panduan detail.
