# Turosa - Kitab Learning App

Media belajar Kitab Kuning dengan teknologi modern.

## 🎯 Tentang Turosa

Turosa adalah platform pembelajaran digital yang dirancang khusus untuk mengakses, membaca, dan mempelajari Kitab Kuning. Menggunakan teknologi modern seperti AI dan OCR, Turosa memudahkan santri dan pembelajar untuk berinteraksi dengan teks klasik Islam.

## 🎨 Tema Visual

Platform ini menggunakan tema klasik Islam dengan palet warna:
- **Primary (Hijau Tua)**: `#1B5E20` - Melambangkan kedamaian dan spiritualitas
- **Secondary (Krem)**: `#F5F5DC` - Memberikan nuansa tradisional dan hangat
- **Accent (Coklat)**: `#5D4037` - Menambah kesan klasik dan elegan

## 📁 Struktur Proyek

```
turosa/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Root layout dengan tema Islam & Arabic fonts
│   │   ├── page.tsx      # Landing page
│   │   ├── dashboard/    # Dashboard pengguna dengan real-time stats
│   │   ├── library/      # Perpustakaan digital
│   │   ├── auth/         # Autentikasi (login/register)
│   │   ├── upload/       # Upload kitab
│   │   ├── reader/       # Pembaca kitab
│   │   │   └── [bookId]/
│   │   │       ├── page.tsx              # Book overview
│   │   │       └── chapter/[chapterId]/  # Chapter reader
│   │   ├── digitize/     # Digitalisasi dengan OCR
│   │   ├── quiz/         # Kuis interaktif
│   │   ├── forum/        # Forum diskusi
│   │   └── profile/      # Profil pengguna
│   ├── components/
│   │   └── ui/          # Komponen UI dasar
│   ├── lib/
│   │   ├── supabase.ts  # Konfigurasi Supabase
│   │   └── progress.ts  # Progress tracking helpers
│   └── types/
│       └── database.ts  # TypeScript database types
├── supabase/
│   └── migrations/      # Database migrations
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🚀 Fitur Utama

### Fase 1 - Fondasi ✅
- ✅ Setup proyek Next.js dengan TypeScript
- ✅ Konfigurasi Tailwind CSS dengan tema Islam
- ✅ Struktur halaman dasar
- ✅ Layout responsif dengan tema klasik

### Fase 2 - Autentikasi & Database ✅
- ✅ Integrasi Supabase Auth
- ✅ Database schema untuk users, books, progress
- ✅ Role-based access control

### Fase 3 - Upload & OCR ✅
- ✅ Upload kitab (PDF/gambar)
- ✅ OCR dengan Google Cloud Vision API
- ✅ Text extraction dan digitalisasi
- ✅ Chapter management system

### Fase 4 - Reader & Progress Tracking ✅
- ✅ Enhanced chapter reader dengan tipografi Arab
- ✅ Navigasi antar bab (Previous/Next)
- ✅ Progress tracking otomatis
- ✅ Mark chapter as completed
- ✅ Real-time dashboard dengan statistik
- ✅ "Continue Learning" feature

### Fase 5 - AI & Quiz ✅
- ✅ Chat AI untuk bantuan pembelajaran
- ✅ Generator kuis otomatis
- ✅ Sistem penilaian adaptif

### Fase 6 - Forum & Komunitas ✅
- ✅ Forum diskusi
- ✅ Komentar per halaman kitab
- ✅ Sistem reputasi

## 🛠️ Teknologi

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (Auth, Database, Storage)
- **AI**: OpenAI API (untuk chat dan quiz generation)
- **OCR**: Google Cloud Vision API
- **Deployment**: Vercel

## 📦 Instalasi

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🚀 Deploy ke Vercel

Aplikasi ini telah dioptimasi dan siap untuk deployment di Vercel:

1. **Quick Deploy**: Ikuti panduan lengkap di [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Production Checklist**: Lihat [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)
3. **Environment Setup**: Copy `.env.example` ke `.env.local` dan isi semua nilai

### Fitur Production Ready
- ✅ Security headers (HSTS, X-Frame-Options, CSP)
- ✅ Image optimization (WebP/AVIF)
- ✅ Automatic compression
- ✅ Health check endpoint (`/api/health`)
- ✅ Error handling untuk production
- ✅ Environment variable validation

## 🌐 Environment Variables

### ⚠️ Masalah Upload PDF? Lihat [SETUP_GUIDE.md](SETUP_GUIDE.md) untuk solusi lengkap!

### Prerequisites

Sebelum menjalankan aplikasi, pastikan Anda memiliki:

1. **Supabase Account**: Untuk database dan authentication
   - `NEXT_PUBLIC_SUPABASE_URL` - URL project Supabase Anda
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon/Public key dari Supabase

2. **Google Cloud Platform**: Untuk OCR (Google Cloud Vision API)
   - `GOOGLE_CLIENT_EMAIL` - Service account email
   - `GOOGLE_PRIVATE_KEY` - Service account private key
   - `GOOGLE_PROJECT_ID` - Google Cloud project ID

3. **OpenAI Account**: Untuk AI Chat dan Quiz Generation
   - `OPENAI_API_KEY` - API key dari OpenAI

### Setup Instructions

1. Copy file template environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. Isi semua nilai di file `.env.local` dengan credentials Anda

3. Untuk Google Cloud Vision, pastikan service account memiliki akses ke Vision API

4. Jangan commit file `.env.local` ke repository (sudah ada di `.gitignore`)

## 📝 Rencana Implementasi

### Fase 1: Fondasi (Week 1-2) ✅
- ✅ Setup proyek Next.js
- ✅ Konfigurasi Tailwind dengan tema Islam
- ✅ Struktur folder dan routing dasar
- ✅ Komponen UI dasar

### Fase 2: Autentikasi & Database (Week 3-4) ✅
- ✅ Setup Supabase project
- ✅ Implementasi auth (email/password)
- ✅ Database schema design
- ✅ User profile management

### Fase 3: Upload & OCR (Week 5-6) ✅
- ✅ Upload kitab functionality
- ✅ OCR integration
- ✅ Text processing dan storage
- ✅ Metadata management

### Fase 4: Reader & Interaksi (Week 7-8) ✅
- ✅ Kitab reader dengan zoom/pan
- ✅ Bookmark dan highlight
- ✅ Catatan dan anotasi
- ✅ Progress tracking

### Fase 5: AI & Quiz (Week 9-10) ✅
- ✅ AI chat integration
- ✅ Quiz generator dengan AI
- ✅ Adaptive quiz system
- ✅ Scoring dan feedback

### Fase 6: Forum & Komunitas (Week 11-12) ✅
- ✅ Forum diskusi
- ✅ Comment system per halaman
- ✅ Reputation system
- ✅ Moderation tools

### Fase 7: Optimisasi & Polish (Week 13-14) ✅
- ✅ Performance optimization
- ✅ SEO optimization
- ✅ PWA implementation
- ✅ Testing dan bug fixes

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat Pull Request atau buka Issue untuk diskusi fitur baru.

## 📄 Lisensi

[MIT License](LICENSE)

## 👥 Tim

Dikembangkan dengan ❤️ untuk kemudahan pembelajaran Kitab Kuning.

---

**Status Proyek**: 🟢 Production Ready - All Phases Completed ✅

## 📚 Documentation

- **[Setup Guide - Panduan Lengkap Setup](SETUP_GUIDE.md)** - 🔥 **BACA INI JIKA UPLOAD PDF GAGAL!**
- **[Testing Guide - Comprehensive Testing](TESTING_GUIDE.md)** - 🧪 **Testing & troubleshooting guide**
- **[Learning Path - User Journey](LEARNING_PATH.md)** - 📖 **Complete learning experience documentation**
- [Phase 3 Implementation](IMPLEMENTATION_SUMMARY.md) - OCR & Digitization
- [Phase 4 Implementation](PHASE4_IMPLEMENTATION.md) - Interactive Reader & Progress Tracking
- [Digitization Guide](DIGITIZATION_GUIDE.md) - User guide for digitizing books
- [Deployment Guide](DEPLOYMENT.md) - Deploy to Vercel
- [Production Checklist](PRODUCTION_CHECKLIST.md) - Pre-deployment checklist

## 🧪 Quick Start Testing

### Validate Your Setup
```bash
# Run comprehensive health check
npm run test:setup

# Verify database schema
npm run verify:database

# Storage setup guide
npm run setup:storage

# Generate test data (reference)
npm run generate:test-data
```

### Health Dashboard
Access real-time system health at `/admin/health`:
- Database connection status
- Storage buckets verification
- API credentials check
- Configuration completeness
- Actionable recommendations

### Testing Scripts
All testing scripts available via npm:
- `npm run test:setup` - Environment validation & health check
- `npm run verify:database` - Database schema verification
- `npm run setup:storage` - Storage bucket setup guide
- `npm run generate:test-data` - Test data generator reference
- `npm run health` - Alias for test:setup

## 🔧 Troubleshooting

### Upload PDF Fails?
1. Run `npm run test:setup` to check configuration
2. Visit `/admin/health` for detailed diagnostics
3. Check [TESTING_GUIDE.md](TESTING_GUIDE.md) for solutions
4. Verify Supabase credentials in `.env.local`
5. Ensure storage buckets exist in Supabase Dashboard

### Common Issues

#### "Invalid API key" Error
```bash
# Check environment variables
npm run test:setup

# Expected: All SUPABASE env vars should be configured
# If not, update .env.local and restart: npm run dev
```

#### Database Table Missing
```bash
# Verify database
npm run verify:database

# Create missing tables via Supabase migrations
```

#### OCR Not Working
- Verify Google Cloud Vision credentials configured
- Check API is enabled in Google Cloud Console
- See [TESTING_GUIDE.md](TESTING_GUIDE.md) for details

See **[TESTING_GUIDE.md](TESTING_GUIDE.md)** for comprehensive troubleshooting guide.
