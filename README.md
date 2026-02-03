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
│   │   ├── layout.tsx    # Root layout dengan tema Islam
│   │   ├── page.tsx      # Landing page
│   │   ├── dashboard/    # Dashboard pengguna
│   │   ├── library/      # Perpustakaan digital
│   │   ├── auth/         # Autentikasi (login/register)
│   │   ├── upload/       # Upload kitab
│   │   ├── reader/       # Pembaca kitab
│   │   ├── quiz/         # Kuis interaktif
│   │   ├── forum/        # Forum diskusi
│   │   └── profile/      # Profil pengguna
│   ├── components/
│   │   └── ui/          # Komponen UI dasar
│   └── lib/
│       └── supabase.ts  # Konfigurasi Supabase
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🚀 Fitur Utama

### Fase 1 - Fondasi (Current)
- ✅ Setup proyek Next.js dengan TypeScript
- ✅ Konfigurasi Tailwind CSS dengan tema Islam
- ✅ Struktur halaman dasar
- ✅ Layout responsif dengan tema klasik

### Fase 2 - Autentikasi & Database (Upcoming)
- 🔜 Integrasi Supabase Auth
- 🔜 Database schema untuk users, books, progress
- 🔜 Role-based access control

### Fase 3 - Upload & OCR (Upcoming)
- 🔜 Upload kitab (PDF/gambar)
- 🔜 OCR dengan Google Cloud Vision API
- 🔜 Text extraction dan indexing

### Fase 4 - Reader & Interaksi (Upcoming)
- 🔜 Pembaca kitab dengan zoom dan navigasi
- 🔜 Bookmark dan highlight
- 🔜 Catatan pribadi

### Fase 5 - AI & Quiz (Upcoming)
- 🔜 Chat AI untuk bantuan pembelajaran
- 🔜 Generator kuis otomatis
- 🔜 Sistem penilaian adaptif

### Fase 6 - Forum & Komunitas (Upcoming)
- 🔜 Forum diskusi
- 🔜 Komentar per halaman kitab
- 🔜 Sistem reputasi

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

## 🌐 Environment Variables

Buat file `.env.local` dengan variabel berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLOUD_VISION_API_KEY=your_google_vision_api_key
```

## 📝 Rencana Implementasi

### Fase 1: Fondasi (Week 1-2) ✅
- Setup proyek Next.js
- Konfigurasi Tailwind dengan tema Islam
- Struktur folder dan routing dasar
- Komponen UI dasar

### Fase 2: Autentikasi & Database (Week 3-4)
- Setup Supabase project
- Implementasi auth (email/password)
- Database schema design
- User profile management

### Fase 3: Upload & OCR (Week 5-6)
- Upload kitab functionality
- OCR integration
- Text processing dan storage
- Metadata management

### Fase 4: Reader & Interaksi (Week 7-8)
- Kitab reader dengan zoom/pan
- Bookmark dan highlight
- Catatan dan anotasi
- Progress tracking

### Fase 5: AI & Quiz (Week 9-10)
- AI chat integration
- Quiz generator dengan AI
- Adaptive quiz system
- Scoring dan feedback

### Fase 6: Forum & Komunitas (Week 11-12)
- Forum diskusi
- Comment system per halaman
- Reputation system
- Moderation tools

### Fase 7: Optimisasi & Polish (Week 13-14)
- Performance optimization
- SEO optimization
- PWA implementation
- Testing dan bug fixes

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat Pull Request atau buka Issue untuk diskusi fitur baru.

## 📄 Lisensi

[MIT License](LICENSE)

## 👥 Tim

Dikembangkan dengan ❤️ untuk kemudahan pembelajaran Kitab Kuning.

---

**Status Proyek**: 🟢 Fase 1 - Fondasi (Completed)
