#!/usr/bin/env node

/**
 * Storage Setup Script
 * Interactive script to setup and configure Supabase storage buckets
 */

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function loadEnv() {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env.local');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          process.env[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      });
    }
  }
}

async function main() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║         Storage Buckets Setup Guide           ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════╝${colors.reset}\n`);
  
  loadEnv();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
    console.log(`${colors.red}❌ Error: NEXT_PUBLIC_SUPABASE_URL not configured${colors.reset}`);
    console.log(`${colors.cyan}Please set NEXT_PUBLIC_SUPABASE_URL in .env.local${colors.reset}\n`);
    process.exit(1);
  }
  
  console.log(`${colors.cyan}Required Storage Buckets:${colors.reset}\n`);
  
  const buckets = [
    {
      name: 'book-covers',
      description: 'Stores book cover images',
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxFileSize: '5MB'
    },
    {
      name: 'book-files',
      description: 'Stores PDF files of books',
      public: false,
      allowedMimeTypes: ['application/pdf'],
      maxFileSize: '50MB'
    }
  ];
  
  buckets.forEach((bucket, index) => {
    console.log(`${index + 1}. ${colors.green}${bucket.name}${colors.reset}`);
    console.log(`   Description: ${bucket.description}`);
    console.log(`   Public: ${bucket.public ? 'Yes' : 'No (RLS protected)'}`);
    console.log(`   Allowed types: ${bucket.allowedMimeTypes.join(', ')}`);
    console.log(`   Max size: ${bucket.maxFileSize}\n`);
  });
  
  console.log(`${colors.cyan}Setup Instructions:${colors.reset}\n`);
  console.log(`1. Go to your Supabase Dashboard: ${colors.green}${supabaseUrl.replace('//', '//app.')}${colors.reset}`);
  console.log(`2. Navigate to Storage in the left sidebar`);
  console.log(`3. Click "New Bucket" for each bucket listed above`);
  console.log(`4. Configure each bucket with the specified settings\n`);
  
  console.log(`${colors.yellow}RLS Policy Configuration:${colors.reset}\n`);
  console.log(`For ${colors.green}book-covers${colors.reset} bucket:`);
  console.log(`   - Policy: Allow public read access`);
  console.log(`   - Allow authenticated users to upload\n`);
  
  console.log(`For ${colors.green}book-files${colors.reset} bucket:`);
  console.log(`   - Policy: Allow authenticated users to read/write their own files`);
  console.log(`   - Files are accessed via signed URLs\n`);
  
  console.log(`${colors.cyan}Testing Storage:${colors.reset}\n`);
  console.log(`After creating buckets, test upload functionality by:`);
  console.log(`1. Login to the app`);
  console.log(`2. Navigate to Upload page`);
  console.log(`3. Try uploading a book with cover image\n`);
  
  console.log(`${colors.green}✅ This script can be run multiple times safely${colors.reset}\n`);
}

main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
