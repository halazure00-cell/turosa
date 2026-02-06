# Deployment Guide - Vercel with Dual AI Providers

## 🚀 Quick Deploy to Vercel

### Prerequisites
Before deploying, ensure you have:
1. A Vercel account (https://vercel.com)
2. All required API keys and credentials
3. Your Supabase project configured
4. (Optional) OpenRouter API key for AI features

### Required Environment Variables

Set these in your Vercel project settings (Project Settings → Environment Variables):

#### Supabase Configuration (Required)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### AI Provider Configuration (Choose One or Both)

**Option 1: OpenRouter (Recommended for Vercel)**
```
AI_PROVIDER_MODE=openrouter
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
```

**Option 2: Ollama (For Self-Hosted)**
```
AI_PROVIDER_MODE=ollama
AI_BASE_URL=https://your-ollama-server:11434
AI_MODEL=qwen2.5:7b
```

**Option 3: Hybrid/Auto (Best of Both)**
```
AI_PROVIDER_MODE=auto
OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
AI_BASE_URL=https://your-ollama-server:11434  # Optional fallback
AI_MODEL=qwen2.5:7b                            # Optional fallback
```

**Note:** OCR functionality is built-in using Tesseract.js (no additional API keys required).

### Recommended Setup for Vercel

For Vercel deployments, we **strongly recommend OpenRouter** because:

✅ **No server management** - Cloud-based AI  
✅ **Completely free** - Free tier models  
✅ **Excellent Arabic support** - Perfect for Kitab learning  
✅ **Serverless-friendly** - Works perfectly with Vercel  
✅ **No cold starts** - Always ready  
✅ **Global CDN** - Fast worldwide  

**Minimal Vercel Configuration:**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
AI_PROVIDER_MODE=openrouter
OPENROUTER_API_KEY=sk-or-v1-your-key
```

### Getting OpenRouter API Key (FREE)

1. Visit [openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up with GitHub, Google, or email (completely free)
3. Click "Create Key"
4. Copy the key (starts with `sk-or-v1-`)
5. Add to Vercel environment variables
6. Done! No credit card required.

For detailed model information, see [docs/OPENROUTER_FREE_MODELS.md](docs/OPENROUTER_FREE_MODELS.md).

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the `turosa` repository

2. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Add Environment Variables**
   - Navigate to Project Settings → Environment Variables
   - **For OpenRouter (Recommended):**
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
     AI_PROVIDER_MODE=openrouter
     OPENROUTER_API_KEY=sk-or-v1-your-key
     ```
   - **For Ollama (Advanced):**
     - Ensure your Ollama server is publicly accessible
     - Use HTTPS for security
     - Set up authentication/VPN
     ```
     AI_BASE_URL=https://your-ollama-server.com:11434
     AI_MODEL=qwen2.5:7b
     AI_PROVIDER_MODE=ollama
     ```
   - **For Hybrid Mode:**
     - Add both OpenRouter and Ollama variables
     - Set `AI_PROVIDER_MODE=auto` or `hybrid`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to set up environment variables
```

### Ollama Server Deployment

#### Option 1: Deploy on Same Server (Development/Small Scale)
```bash
# Install Ollama on your server
curl -fsSL https://ollama.com/install.sh | sh

# Pull your model
ollama pull llama2

# Run Ollama (it runs on port 11434 by default)
ollama serve
```

#### Option 2: Separate Ollama Server (Production/Scale)
1. **Deploy Ollama on a separate server/container**
   - Can use Docker: `docker run -d -p 11434:11434 ollama/ollama`
   - Or dedicated server with Ollama installed
   
2. **Configure networking and security**
   - Ensure server is accessible from Vercel
   - Use HTTPS for production (reverse proxy with nginx/caddy)
   - Set appropriate firewall rules
   - **Important**: Implement authentication or use VPN/private networking to prevent unauthorized access
   - Consider rate limiting to prevent abuse
   
3. **Update Environment Variables**
   ```
   AI_BASE_URL=https://your-ollama-server.com:11434
   AI_MODEL=llama2
   ```

### Post-Deployment Configuration

#### 1. Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Configure DNS records as instructed

#### 2. Verify Deployment
- Visit `/api/health` endpoint to check server status
- Test authentication flow
- Verify OCR functionality (built-in with Tesseract.js)
- Test AI chat features (ensure Ollama server is reachable)

#### 3. Monitor Application
- Check Vercel Analytics for performance metrics
- Monitor Runtime Logs for errors
- Monitor Ollama server health and resource usage
- Set up alerts for critical issues

### Security Checklist

- ✅ All sensitive credentials in environment variables (not in code)
- ✅ Security headers configured (X-Frame-Options, CSP, etc.)
- ✅ HTTPS enabled by default on Vercel
- ✅ API routes protected with proper validation
- ✅ Error messages don't expose sensitive information in production

### Performance Optimizations Applied

- ✅ Image optimization with WebP/AVIF formats
- ✅ Automatic code splitting
- ✅ Static page generation where possible
- ✅ Edge caching enabled
- ✅ Gzip compression enabled
- ✅ React strict mode for better error detection

### Troubleshooting

#### Build Failures
- Check that all environment variables are set correctly
- Verify Node.js version compatibility (using Node 20+)
- Review build logs in Vercel dashboard

#### Runtime Errors
- Check Runtime Logs in Vercel dashboard
- Verify all API endpoints are accessible
- Ensure database migrations are applied

#### Environment Variable Issues
- Verify `AI_BASE_URL` points to accessible Ollama server
- Ensure all `NEXT_PUBLIC_` prefixed vars are set for client-side access
- Redeploy after updating environment variables

#### Ollama Connection Issues
- Check Ollama server is running: `curl http://your-server:11434/api/tags`
- Verify network connectivity from Vercel to Ollama server
- Check firewall rules allow traffic on port 11434
- Ensure model is pulled: `ollama pull llama2`

### Continuous Deployment

Vercel automatically:
- Builds and deploys on every push to main branch
- Creates preview deployments for pull requests
- Rolls back to previous deployment if needed

### Maintenance

#### Update Dependencies
```bash
npm update
npm audit fix
```

#### Database Migrations
- Apply Supabase migrations before deploying code changes
- Test migrations in staging environment first

### Support & Resources

- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Project Repository: https://github.com/halazure00-cell/turosa

---

**Status**: ✅ Production Ready
**Framework**: Next.js 16.1.5
**Deployment Platform**: Vercel
**Region**: Singapore (sin1) - Recommended for Asian users
