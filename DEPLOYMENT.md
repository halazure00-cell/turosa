# Deployment Guide - Vercel

## 🚀 Quick Deploy to Vercel

### Prerequisites
Before deploying, ensure you have:
1. A Vercel account (https://vercel.com)
2. All required API keys and credentials
3. Your Supabase project configured

### Required Environment Variables

Set these in your Vercel project settings (Project Settings → Environment Variables):

#### Supabase Configuration
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Ollama AI Configuration (for AI Chat and Quiz)
```
AI_BASE_URL=http://your-ollama-server:11434
AI_MODEL=llama2
```

**Note:** OCR functionality is built-in using Tesseract.js (no additional API keys required).

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
   - Add all required variables listed above
   - **Important**: For `AI_BASE_URL`, ensure your Ollama server is accessible from Vercel
     - Use a public URL or Vercel-accessible internal URL
     - Default Ollama port is 11434

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
