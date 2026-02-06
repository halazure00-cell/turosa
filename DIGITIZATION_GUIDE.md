# Digitization Guide - OCR untuk Kitab Kuning

## 🎯 Overview

Turosa menggunakan **Tesseract.js** untuk OCR (Optical Character Recognition) yang memungkinkan digitalisasi teks Arab dari gambar Kitab Kuning.

### Keuntungan Tesseract.js
- ✅ **Built-in**: Otomatis tersedia saat `npm install`, tidak perlu konfigurasi tambahan
- ✅ **Free**: 100% gratis, tidak ada biaya API
- ✅ **Privacy**: Semua proses OCR dilakukan locally, data tidak dikirim ke cloud
- ✅ **Offline**: Bekerja tanpa koneksi internet
- ✅ **Arabic Support**: Mendukung bahasa Arab untuk Kitab Kuning

## 🚀 Setup (Sudah Otomatis!)

Tesseract.js sudah terinstall otomatis ketika Anda menjalankan:
```bash
npm install
```

**Tidak perlu setup credentials atau API keys!** OCR langsung siap digunakan.

## 📋 Cara Menggunakan OCR

### Via UI (Recommended)

1. **Upload Kitab** di halaman `/upload`
2. **Digitize** - Klik tombol "Digitize" pada kitab
3. **Upload Gambar** - Upload gambar halaman kitab (JPG, PNG, etc.)
4. **Wait** - Tesseract.js akan memproses gambar (biasanya 5-30 detik)
5. **Review** - Hasil OCR akan ditampilkan untuk di-review dan edit
6. **Save** - Simpan sebagai chapter

## 📊 Perbandingan

| Aspek | Tesseract.js (Now) | Google Cloud Vision (Old) |
|-------|-------------------|---------------------------|
| **Cost** | ✅ Free | $$ Paid |
| **Setup** | ✅ Built-in | ❌ Requires credentials |
| **Privacy** | ✅ Local | ❌ Data sent to Google |
| **Offline** | ✅ Yes | ❌ No |

## 📚 Resources

- **Tesseract.js Docs**: https://tesseract.projectnaptha.com/
- **Migration Guide**: See MIGRATION_GUIDE.md
