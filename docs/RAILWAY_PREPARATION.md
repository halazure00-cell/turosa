# Railway Deployment Preparation Guide

## Overview

This guide prepares Turosa for future deployment on [Railway](https://railway.app), a platform that provides more flexibility than Vercel for running backend services like Ollama.

**Status:** 🚧 Preparation only - Railway deployment is optional and not implemented yet.

## Why Railway?

Railway is an excellent alternative to Vercel when you need:

✅ **Long-running processes** - Can run Ollama server alongside app  
✅ **More resource control** - Better for AI workloads  
✅ **WebSocket support** - For real-time features  
✅ **Database hosting** - Can host Supabase alternatives  
✅ **Docker support** - Full container deployment  

## Current Configuration Status

Turosa is already designed to work with Railway:

### ✅ Environment Variables
All configuration uses env vars (Railway-compatible)

### ✅ Dual Provider Support
Can use OpenRouter (serverless) or Ollama (Railway-hosted)

### ✅ Health Checks
Monitoring endpoints for Railway's health checks

### ✅ Next.js App
Compatible with Railway's Next.js deployment

## Railway Deployment Architecture

### Option 1: App Only (OpenRouter)
```
Railway Service: Next.js App
├─ Uses OpenRouter for AI
├─ Connects to external Supabase
└─ No Ollama needed
```

**Pros:** Simple, cost-effective  
**Cons:** Depends on external services

### Option 2: App + Ollama (Full Stack)
```
Railway Project
├─ Service 1: Next.js App
└─ Service 2: Ollama Server
   └─ Private networking
```

**Pros:** Complete control, privacy  
**Cons:** Higher resource usage, more expensive

## Environment Variables for Railway

### For OpenRouter Mode
```bash
# Railway Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
AI_PROVIDER_MODE=openrouter
OPENROUTER_API_KEY=sk-or-v1-your-key
```

### For Ollama Mode
```bash
# Railway Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
AI_PROVIDER_MODE=ollama
AI_BASE_URL=http://ollama:11434  # Railway internal URL
AI_MODEL=qwen2.5:7b
```

### For Hybrid Mode
```bash
# Railway Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
AI_PROVIDER_MODE=hybrid
OPENROUTER_API_KEY=sk-or-v1-your-key
AI_BASE_URL=http://ollama:11434
AI_MODEL=qwen2.5:7b
```

## Deployment Steps (When Ready)

### Step 1: Create Railway Project

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### Step 2: Deploy Next.js App

```bash
# Link to Railway
railway link

# Add environment variables
railway variables set NEXT_PUBLIC_SUPABASE_URL=...
railway variables set OPENROUTER_API_KEY=...
railway variables set AI_PROVIDER_MODE=openrouter

# Deploy
railway up
```

### Step 3: (Optional) Add Ollama Service

Create `railway.json` in project root:

```json
{
  "services": {
    "app": {
      "buildCommand": "npm run build",
      "startCommand": "npm start",
      "healthcheckPath": "/api/health"
    },
    "ollama": {
      "image": "ollama/ollama:latest",
      "startCommand": "ollama serve",
      "env": {
        "OLLAMA_HOST": "0.0.0.0:11434"
      }
    }
  }
}
```

## Cost Estimation

### Railway Pricing (Hobby Plan)
- **Free Tier**: $5 credit/month
- **Hobby**: $5/month + usage
- **Pro**: $20/month + usage

### Typical Costs for Turosa

**Option 1: OpenRouter Only**
- Railway: ~$5/month (minimal resources)
- OpenRouter: $0 (free tier)
- **Total: ~$5/month**

**Option 2: With Ollama**
- Railway: ~$15-25/month (more resources)
- Ollama: $0 (self-hosted)
- **Total: ~$15-25/month**

## Comparison: Vercel vs Railway

| Feature | Vercel | Railway |
|---------|--------|---------|
| **Next.js Support** | ✅ Excellent | ✅ Good |
| **Free Tier** | ✅ Generous | ⚠️ Limited ($5) |
| **Ollama Support** | ❌ No | ✅ Yes |
| **Serverless** | ✅ Yes | ⚠️ Optional |
| **Build Time** | ✅ Fast | ⚠️ Moderate |
| **Global CDN** | ✅ Yes | ⚠️ Limited |
| **WebSockets** | ⚠️ Limited | ✅ Full |
| **Custom Docker** | ❌ No | ✅ Yes |
| **Best For** | Production apps | Full-stack apps |

## Recommendation

**For Turosa:**

### Use Vercel if:
- ✅ Using OpenRouter (free tier AI)
- ✅ Want simplest deployment
- ✅ Free tier is sufficient
- ✅ Need global CDN

### Use Railway if:
- ✅ Want to self-host Ollama
- ✅ Need more control over resources
- ✅ Want to run background jobs
- ✅ Have budget for hosting (~$5-25/month)

### Best Approach:
1. **Start with Vercel + OpenRouter** (completely free)
2. **Migrate to Railway later** if you need Ollama or more control

## Health Check Configuration

Railway can use our existing health endpoint:

```json
{
  "healthcheck": {
    "path": "/api/health",
    "interval": 30,
    "timeout": 5
  }
}
```

## Database Options

### Option 1: Keep Supabase (Recommended)
- Already configured
- Generous free tier
- No changes needed

### Option 2: Railway Postgres
```bash
# Add Postgres service
railway add postgres

# Update environment
NEXT_PUBLIC_SUPABASE_URL=railway-postgres-url
```

### Option 3: Railway MySQL
Similar to Postgres option

## Monitoring

Railway provides built-in monitoring:

- **Metrics**: CPU, Memory, Network
- **Logs**: Real-time application logs
- **Alerts**: Custom alert rules
- **Deployments**: Automatic rollback

Use Turosa's health endpoints:
- `/api/health` - Basic health
- `/api/admin/health` - Detailed system status

## Security

### Environment Variables
- Stored encrypted in Railway
- Injected at runtime
- Never committed to code

### Private Networking
- Use Railway's internal URLs
- Ollama: `http://ollama:11434` (not public)
- Secure service-to-service communication

### SSL/TLS
- Automatic HTTPS
- Free SSL certificates
- Enforced secure connections

## Migration Checklist

When ready to deploy to Railway:

- [ ] Create Railway account
- [ ] Install Railway CLI
- [ ] Test app locally with Railway env vars
- [ ] Deploy app service
- [ ] Configure environment variables
- [ ] Test health endpoints
- [ ] (Optional) Add Ollama service
- [ ] Configure domain
- [ ] Set up monitoring
- [ ] Test AI features
- [ ] Monitor costs

## Rollback Plan

If Railway deployment has issues:

1. **Keep Vercel running** (zero downtime)
2. **Test Railway thoroughly** before switching
3. **Use Railway staging** for testing
4. **DNS switch** when confident
5. **Keep Vercel as fallback** for 1 week

## Future Enhancements

Railway enables features not possible on Vercel:

### Planned Features
- [ ] Real-time chat (WebSockets)
- [ ] Background job processing
- [ ] Scheduled quiz generation
- [ ] PDF processing pipeline
- [ ] Advanced caching layer

### Nice to Have
- [ ] Redis for caching
- [ ] Queue system (BullMQ)
- [ ] Elasticsearch for search
- [ ] Custom ML models

## Resources

- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Railway Templates: [railway.app/templates](https://railway.app/templates)
- Railway CLI: [github.com/railwayapp/cli](https://github.com/railwayapp/cli)
- Ollama on Railway: [railway.app/template/ollama](https://railway.app/template/ollama)

## Support

For Railway deployment questions:
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Railway Status: [status.railway.app](https://status.railway.app)
- Turosa Issues: [github.com/halazure00-cell/turosa/issues](https://github.com/halazure00-cell/turosa/issues)

## Summary

✅ Turosa is Railway-ready  
✅ No code changes needed  
✅ Start with Vercel + OpenRouter (free)  
✅ Migrate to Railway when needed  
✅ Dual provider support enables flexibility  

Railway deployment is **optional** and **future-ready** - deploy when you need the extra capabilities! 🚂
