# AI Provider Setup Guide

## Overview

Turosa supports dual AI providers for maximum flexibility, reliability, and cost-efficiency:

1. **OpenRouter (Free Tier)** - Cloud-based AI with excellent Arabic support
2. **Ollama (Local)** - Privacy-focused, offline-capable AI

## Provider Modes

Configure your preferred mode using the `AI_PROVIDER_MODE` environment variable:

### 1. Auto Mode (Recommended)
```bash
AI_PROVIDER_MODE=auto
```
- **Smart Selection**: Automatically chooses the best available provider
- **Priority**: OpenRouter first (free tier), then Ollama (local)
- **Fallback**: Seamlessly switches if primary fails
- **Best For**: Production deployments with reliability needs

### 2. OpenRouter Mode
```bash
AI_PROVIDER_MODE=openrouter
```
- **Cloud-Only**: Uses only OpenRouter free tier models
- **Requirements**: `OPENROUTER_API_KEY` must be configured
- **Best For**: Vercel deployments, cloud environments
- **Cost**: $0 (free tier)

### 3. Ollama Mode
```bash
AI_PROVIDER_MODE=ollama
```
- **Local-Only**: Uses only your local Ollama server
- **Requirements**: Ollama installed and running
- **Best For**: Privacy-critical use cases, offline scenarios
- **Cost**: $0 (runs on your hardware)

### 4. Hybrid Mode
```bash
AI_PROVIDER_MODE=hybrid
```
- **Flexible**: Supports both providers with intelligent fallback
- **Requirements**: At least one provider configured
- **Best For**: Development, testing, maximum flexibility

## OpenRouter Setup (FREE)

### Step 1: Get Your Free API Key

1. Visit [openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up with GitHub, Google, or email (free)
3. Create a new API key
4. Copy the key (starts with `sk-or-v1-...`)

### Step 2: Configure Environment

Add to your `.env` file:

```bash
# OpenRouter Configuration
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
AI_PROVIDER_MODE=openrouter  # or auto/hybrid
```

### Step 3: Restart Application

```bash
npm run dev
```

### Available Free Models

OpenRouter provides free access to several excellent models:

1. **Llama 3.1 8B Instruct** (Recommended)
   - Excellent Arabic language support
   - Great for Kitab learning
   - 131K context window

2. **Llama 3.2 3B Instruct**
   - Faster responses
   - Good for simple queries
   - 131K context window

3. **Gemma 2 9B IT**
   - Google's multilingual model
   - Good general performance
   - 8K context window

4. **Mistral 7B Instruct**
   - Fast and efficient
   - Solid Arabic support
   - 32K context window

5. **Hermes 3 Llama 3.1 405B**
   - Most advanced option
   - Superior reasoning
   - Best for complex queries

## Ollama Setup (Privacy-Focused)

### Step 1: Install Ollama

**macOS/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Windows:**
Download installer from [ollama.com/download](https://ollama.com/download)

### Step 2: Download a Model

Recommended models for Arabic and Islamic studies:

```bash
# Qwen2.5 7B (Recommended - excellent Arabic)
ollama pull qwen2.5:7b

# Alternative: Llama 3.1 8B
ollama pull llama3.1:8b

# Alternative: Mistral 7B
ollama pull mistral:7b
```

### Step 3: Start Ollama Server

```bash
ollama serve
```

The server runs on `http://localhost:11434` by default.

### Step 4: Configure Environment

Add to your `.env` file:

```bash
# Ollama Configuration
AI_BASE_URL=http://localhost:11434
AI_MODEL=qwen2.5:7b
AI_PROVIDER_MODE=ollama  # or auto/hybrid
```

### Step 5: Restart Application

```bash
npm run dev
```

## Vercel Deployment with OpenRouter

For Vercel deployments, OpenRouter is the recommended provider:

### 1. Add Environment Variables in Vercel

In your Vercel project settings (Environment Variables):

```
OPENROUTER_API_KEY=sk-or-v1-your-api-key
AI_PROVIDER_MODE=openrouter
```

### 2. Deploy

```bash
vercel --prod
```

Your Turosa app will now use OpenRouter's free tier for AI features!

## Testing Your Configuration

### Admin Dashboard

1. Navigate to `/admin/health`
2. Check "AI Providers & APIs" section
3. Verify your provider(s) show as "available"

### AI Config Page

1. Navigate to `/admin/ai-config`
2. View all available providers and models
3. Change provider mode if needed
4. Test with a chat query

### Health Check API

```bash
curl http://localhost:3000/api/health
```

Response should include AI provider status:

```json
{
  "status": "ok",
  "ai": {
    "mode": "auto",
    "providers": [
      {
        "type": "openrouter",
        "available": true
      },
      {
        "type": "ollama", 
        "available": true
      }
    ]
  }
}
```

## Troubleshooting

### OpenRouter Issues

**"OpenRouter API key not configured"**
- Verify `OPENROUTER_API_KEY` is set in environment
- Check the key starts with `sk-or-v1-`
- Restart the application

**"OpenRouter API error: 401"**
- API key is invalid or expired
- Generate a new key at openrouter.ai/keys

**"OpenRouter API error: 429"**
- Rate limit exceeded (rare on free tier)
- Wait a few minutes and try again

### Ollama Issues

**"Cannot connect to Ollama server"**
- Verify Ollama is running: `ollama list`
- Check the base URL is correct
- Ensure port 11434 is not blocked

**"Model not found"**
- Pull the model: `ollama pull qwen2.5:7b`
- Update `AI_MODEL` to match an installed model
- List available models: `ollama list`

**Slow responses**
- Ollama performance depends on your hardware
- Try a smaller model (3B instead of 7B)
- Consider using OpenRouter instead

### Auto/Hybrid Mode Issues

**Fallback not working**
- Check both providers in admin dashboard
- Review logs for error messages
- Ensure at least one provider is configured

## Best Practices

### For Production (Vercel)
```bash
AI_PROVIDER_MODE=auto
OPENROUTER_API_KEY=sk-or-v1-...
# Ollama not needed on Vercel
```

### For Development
```bash
AI_PROVIDER_MODE=hybrid
OPENROUTER_API_KEY=sk-or-v1-...
AI_BASE_URL=http://localhost:11434
AI_MODEL=qwen2.5:7b
```

### For Privacy/Offline
```bash
AI_PROVIDER_MODE=ollama
AI_BASE_URL=http://localhost:11434
AI_MODEL=qwen2.5:7b
# OpenRouter not needed
```

## Cost Monitoring

Both providers are **100% FREE**:

- **OpenRouter**: Uses only free-tier models
- **Ollama**: Runs locally on your hardware

You can verify costs in the admin dashboard:
- Navigate to `/admin/ai-config`
- All models show "Free" badge
- Cost estimation always returns $0

## Security

### API Keys
- Never commit API keys to version control
- Use environment variables only
- Rotate keys regularly

### Ollama
- Runs locally - no data leaves your machine
- Perfect for sensitive content
- No internet required

### OpenRouter
- Data sent to OpenRouter's servers
- Free tier has usage limits
- Review OpenRouter's privacy policy

## Need Help?

- Check `/admin/health` for system status
- Review application logs for errors
- See `DEPLOYMENT.md` for deployment guides
- Open an issue on GitHub for bugs
