# Migration Guide: OpenAI + Google Cloud Vision → Ollama + Tesseract.js

## 📋 Overview

Turosa has migrated from paid cloud APIs to open-source alternatives to provide:
- ✅ **Free & Open Source**: No API costs or billing concerns
- ✅ **Full Control**: Self-hosted, no vendor lock-in
- ✅ **Privacy**: Data stays on your infrastructure
- ✅ **Offline Capable**: Works without internet (when self-hosted)

## 🔄 What Changed

### Before (Paid APIs)
- **AI Chat & Quiz**: OpenAI API (gpt-4o-mini) - Requires API key, costs per token
- **OCR**: Google Cloud Vision API - Requires service account, costs per image

### After (Open Source)
- **AI Chat & Quiz**: Ollama (self-hosted LLM) - Free, runs locally or on your server
- **OCR**: Tesseract.js - Free, built-in, no configuration needed

## 📊 Comparison

| Feature | Old (OpenAI) | New (Ollama) |
|---------|-------------|--------------|
| Cost | $$ Paid per token | ✅ Free |
| Setup | API key required | Install + Download model |
| Privacy | Data sent to OpenAI | ✅ Data stays local |
| Speed | Fast (cloud) | Good (depends on hardware) |
| Offline | ❌ Requires internet | ✅ Works offline |
| Models | gpt-4o-mini | qwen2.5:7b, llama3.1:8b, etc. |

| Feature | Old (Google Vision) | New (Tesseract.js) |
|---------|---------------------|-------------------|
| Cost | $$ Paid per image | ✅ Free |
| Setup | Service account + JSON key | ✅ Built-in (npm install) |
| Privacy | Data sent to Google | ✅ Processes locally |
| Speed | Fast (cloud) | Good (depends on image) |
| Offline | ❌ Requires internet | ✅ Works offline |
| Arabic Support | Excellent | Good |

## 🚀 Installation Guide

### 1. Install Ollama

Ollama is a lightweight tool to run LLMs locally.

#### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### macOS
```bash
# Using Homebrew
brew install ollama

# Or download from: https://ollama.com/download
```

#### Windows
Download installer from: https://ollama.com/download

### 2. Download AI Model

After installing Ollama, download a model. We recommend `qwen2.5:7b` for Arabic support:

```bash
# Start Ollama (if not auto-started)
ollama serve

# In another terminal, download the model
ollama pull qwen2.5:7b
```

**Alternative Models:**
```bash
# For faster performance (smaller model)
ollama pull phi3:3.8b

# For better quality (larger model)
ollama pull llama3.1:8b

# For Arabic-focused tasks
ollama pull mistral:7b
```

### 3. Verify Ollama Installation

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Expected response: JSON with list of downloaded models
```

### 4. Install Tesseract.js

Tesseract.js is automatically installed via npm:

```bash
npm install
```

That's it! OCR is ready to use - no additional configuration needed.

## ⚙️ Configuration

### Environment Variables

Update your `.env.local` file:

```bash
# Supabase (still required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Ollama AI (optional - has defaults)
AI_BASE_URL=http://localhost:11434  # Default if not set
AI_MODEL=qwen2.5:7b                  # Default if not set

# OCR - No configuration needed!
# Tesseract.js is built-in and works automatically
```

### Remove Old Environment Variables

Delete these from your `.env.local`:
```bash
# ❌ No longer needed
OPENAI_API_KEY=...
GOOGLE_CLIENT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_PROJECT_ID=...
```

## 🧪 Testing the Migration

### 1. Test Ollama Connection
```bash
# Start development server
npm run dev

# In another terminal, test AI endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Assalamualaikum"}]}'
```

### 2. Test OCR
```bash
# OCR automatically works - test via UI:
# 1. Go to http://localhost:3000/digitize/[bookId]
# 2. Upload an image
# 3. OCR will process using Tesseract.js
```

### 3. Check Health Status
Visit: http://localhost:3000/admin/health

Should show:
- ✅ Ollama AI: ok (if server running)
- ✅ Tesseract.js OCR: ok (always)

## 📦 Model Recommendations

### For Arabic Text (Kitab Kuning)

| Model | Size | RAM Needed | Arabic Quality | Speed |
|-------|------|-----------|----------------|-------|
| **qwen2.5:7b** ⭐ | 4.7GB | 8GB+ | ⭐⭐⭐⭐⭐ Excellent | Medium |
| llama3.1:8b | 4.9GB | 8GB+ | ⭐⭐⭐⭐ Good | Medium |
| mistral:7b | 4.1GB | 8GB+ | ⭐⭐⭐⭐ Good | Fast |
| phi3:3.8b | 2.3GB | 4GB+ | ⭐⭐⭐ Fair | Very Fast |

**Recommendation**: Use `qwen2.5:7b` for best Arabic support. If you have limited RAM (<8GB), use `phi3:3.8b`.

### Switching Models

```bash
# Download a different model
ollama pull llama3.1:8b

# Update .env.local
AI_MODEL=llama3.1:8b

# Restart development server
npm run dev
```

## 🐛 Troubleshooting

### Issue: "Layanan AI tidak tersedia"

**Cause**: Ollama server not running or model not downloaded.

**Solution**:
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not running, start Ollama
ollama serve

# Download model if needed
ollama pull qwen2.5:7b
```

### Issue: OCR Takes Too Long

**Cause**: Tesseract.js processes images locally, which can be slower than cloud APIs.

**Solutions**:
1. **Reduce image size** before uploading (recommended: max 2MB)
2. **Use better hardware** (faster CPU = faster OCR)
3. **For production**: Consider EasyOCR microservice (see below)

### Issue: Low OCR Accuracy for Arabic

**Cause**: Tesseract.js may struggle with complex Arabic calligraphy or low-quality scans.

**Solutions**:
1. **Use high-quality images** (300+ DPI recommended)
2. **Ensure good lighting** and contrast
3. **For production**: Consider EasyOCR microservice (see below)

### Issue: Ollama Uses Too Much RAM

**Cause**: Large models require significant RAM.

**Solutions**:
```bash
# Use smaller model
ollama pull phi3:3.8b

# Update .env.local
AI_MODEL=phi3:3.8b
```

## 🚀 Production Deployment

### Deploy Ollama on VPS/Cloud

#### Option 1: Same Server as Next.js
```bash
# On your server (Ubuntu/Debian example)
curl -fsSL https://ollama.com/install.sh | sh

# Download model
ollama pull qwen2.5:7b

# Set environment variables
AI_BASE_URL=http://localhost:11434
AI_MODEL=qwen2.5:7b
```

#### Option 2: Separate Ollama Server
```bash
# On Ollama server
curl -fsSL https://ollama.com/install.sh | sh
ollama pull qwen2.5:7b

# Configure Ollama to accept remote connections
export OLLAMA_HOST=0.0.0.0:11434
ollama serve

# On Next.js server, set environment variable
AI_BASE_URL=http://ollama-server-ip:11434
AI_MODEL=qwen2.5:7b
```

### Docker Deployment

```dockerfile
# Dockerfile.ollama
FROM ollama/ollama:latest

# Download model during build (optional, can be done at runtime)
RUN ollama serve & sleep 5 && ollama pull qwen2.5:7b
```

```yaml
# docker-compose.yml
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    
  turosa:
    build: .
    ports:
      - "3000:3000"
    environment:
      - AI_BASE_URL=http://ollama:11434
      - AI_MODEL=qwen2.5:7b
    depends_on:
      - ollama

volumes:
  ollama_data:
```

## 🎯 Advanced: EasyOCR Microservice (Optional)

If Tesseract.js accuracy is insufficient for production Arabic OCR, you can set up an EasyOCR microservice:

### Create OCR Microservice

```python
# ocr-service/main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import easyocr
import numpy as np
from PIL import Image
import io

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize EasyOCR reader (Arabic + English)
reader = easyocr.Reader(['ar', 'en'], gpu=False)

@app.post("/ocr")
async def perform_ocr(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    image_np = np.array(image)
    
    # Perform OCR
    results = reader.readtext(image_np)
    
    # Combine text
    text = ' '.join([result[1] for result in results])
    confidence = sum([result[2] for result in results]) / len(results) if results else 0
    
    return {
        "text": text,
        "confidence": confidence,
        "language": "ar",
        "detectionCount": len(results)
    }

@app.get("/health")
async def health():
    return {"status": "ok", "service": "easyocr"}
```

### Update OCR Provider

Modify `src/lib/ocr-provider.ts` to support remote OCR service:

```typescript
// Add to ocr-provider.ts
const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL

export async function performOCRRemote(imageBase64: string): Promise<OCRResult> {
  if (!OCR_SERVICE_URL) {
    // Fallback to Tesseract.js
    return performOCR(imageBase64)
  }
  
  const response = await fetch(`${OCR_SERVICE_URL}/ocr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: imageBase64 })
  })
  
  return await response.json()
}
```

## 📚 Additional Resources

- **Ollama Documentation**: https://ollama.com/docs
- **Tesseract.js Documentation**: https://tesseract.projectnaptha.com/
- **Model Library**: https://ollama.com/library
- **EasyOCR**: https://github.com/JaidedAI/EasyOCR

## 🎉 Migration Complete!

Your Turosa application now runs on 100% open-source AI and OCR technology!

**Benefits**:
- ✅ No more API costs
- ✅ Full data privacy
- ✅ No vendor lock-in
- ✅ Works offline
- ✅ Complete control

**Next Steps**:
1. Test all features (AI chat, quiz generation, OCR)
2. Monitor performance and adjust models if needed
3. Consider EasyOCR for production if needed
4. Enjoy your free, open-source AI-powered learning platform! 🚀
