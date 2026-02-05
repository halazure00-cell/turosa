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

#### OpenAI API (for AI Chat and Quiz)
```
OPENAI_API_KEY=your_openai_api_key
```

#### Google Cloud Vision API (for OCR)
```
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY=your_service_account_private_key
GOOGLE_PROJECT_ID=your_google_cloud_project_id
```

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
   - **Important**: For `GOOGLE_PRIVATE_KEY`, ensure newlines are properly formatted:
     - Replace `\n` with actual newlines or use the format: `"-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----"`

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

### Post-Deployment Configuration

#### 1. Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Configure DNS records as instructed

#### 2. Verify Deployment
- Visit `/api/health` endpoint to check server status
- Test authentication flow
- Verify OCR functionality
- Test AI chat features

#### 3. Monitor Application
- Check Vercel Analytics for performance metrics
- Monitor Runtime Logs for errors
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
- For `GOOGLE_PRIVATE_KEY`: Use multiline format or escape newlines properly
- Ensure all `NEXT_PUBLIC_` prefixed vars are set for client-side access
- Redeploy after updating environment variables

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
