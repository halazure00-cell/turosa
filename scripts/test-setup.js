#!/usr/bin/env node

/**
 * Turosa Setup Validation Script
 * Validates environment variables, Supabase connection, storage, and API credentials
 */

const https = require('https');
const http = require('http');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Validation results
const results = {
  passed: [],
  failed: [],
  warnings: []
};

let healthScore = 0;
const totalChecks = 12; // Total number of checks

// Helper functions
function pass(message) {
  console.log(`${colors.green}✅ [PASS]${colors.reset} ${message}`);
  results.passed.push(message);
  healthScore++;
}

function fail(message, fix) {
  console.log(`${colors.red}❌ [FAIL]${colors.reset} ${message}`);
  if (fix) {
    console.log(`${colors.cyan}   💡 Fix:${colors.reset} ${fix}`);
  }
  results.failed.push({ message, fix });
}

function warn(message, note) {
  console.log(`${colors.yellow}⚠️  [WARN]${colors.reset} ${message}`);
  if (note) {
    console.log(`${colors.blue}   ℹ️  Note:${colors.reset} ${note}`);
  }
  results.warnings.push({ message, note });
  healthScore += 0.5; // Half credit for warnings
}

function section(title) {
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

// Load environment variables
function loadEnv() {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    // dotenv not installed, try to read manually
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

// Make HTTP request helper
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Validation checks
async function checkEnvironmentVariables() {
  section('1. Environment Variables Check');
  
  // Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
    pass('NEXT_PUBLIC_SUPABASE_URL configured');
  } else {
    fail('NEXT_PUBLIC_SUPABASE_URL not configured or invalid', 
      'Set NEXT_PUBLIC_SUPABASE_URL in .env.local (get from Supabase dashboard)');
  }
  
  if (supabaseKey && supabaseKey.length > 20) {
    pass('NEXT_PUBLIC_SUPABASE_ANON_KEY configured');
  } else {
    fail('NEXT_PUBLIC_SUPABASE_ANON_KEY not configured or invalid',
      'Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (get from Supabase dashboard)');
  }
  
  // Google Cloud Vision (optional)
  const googleEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const googleKey = process.env.GOOGLE_PRIVATE_KEY;
  const googleProject = process.env.GOOGLE_PROJECT_ID;
  
  if (googleEmail && googleKey && googleProject) {
    pass('Google Cloud Vision credentials configured');
  } else {
    warn('Google Cloud Vision credentials not configured',
      'OCR features will not work. Set GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_PROJECT_ID');
  }
  
  // OpenAI (optional)
  const openaiKey = process.env.OPENAI_API_KEY;
  
  if (openaiKey && openaiKey.startsWith('sk-')) {
    pass('OpenAI API key configured');
  } else {
    warn('OpenAI API key not configured',
      'AI chat and quiz generation will not work. Set OPENAI_API_KEY');
  }
}

async function checkSupabaseConnection() {
  section('2. Supabase Connection & Authentication');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    fail('Cannot test connection - credentials not configured');
    return;
  }
  
  try {
    // Test auth endpoint
    const response = await makeRequest(`${supabaseUrl}/auth/v1/health`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey
      }
    });
    
    if (response.statusCode === 200) {
      pass('Supabase connection successful');
    } else {
      fail('Supabase connection failed', 
        `Status: ${response.statusCode}. Check your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY`);
    }
  } catch (error) {
    fail(`Supabase connection error: ${error.message}`,
      'Verify your Supabase URL is correct and accessible');
  }
}

async function checkStorageBuckets() {
  section('3. Storage Buckets Check');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    fail('Cannot test storage - credentials not configured');
    return;
  }
  
  const buckets = ['book-covers', 'book-files'];
  
  for (const bucket of buckets) {
    try {
      const response = await makeRequest(`${supabaseUrl}/storage/v1/bucket/${bucket}`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });
      
      if (response.statusCode === 200) {
        pass(`Storage bucket '${bucket}' exists`);
      } else {
        warn(`Storage bucket '${bucket}' may not exist`,
          `Create bucket '${bucket}' in Supabase Dashboard -> Storage`);
      }
    } catch (error) {
      warn(`Cannot verify bucket '${bucket}': ${error.message}`,
        'Check Supabase storage configuration');
    }
  }
}

async function checkDatabaseTables() {
  section('4. Database Tables Check');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    fail('Cannot test database - credentials not configured');
    return;
  }
  
  const tables = ['books', 'chapters', 'user_progress', 'discussions', 'profiles'];
  
  for (const table of tables) {
    try {
      const response = await makeRequest(
        `${supabaseUrl}/rest/v1/${table}?select=count&limit=0`,
        {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'count=exact'
          }
        }
      );
      
      if (response.statusCode === 200 || response.statusCode === 206) {
        pass(`Database table '${table}' accessible`);
      } else {
        warn(`Database table '${table}' may not exist`,
          `Run migrations to create '${table}' table`);
      }
    } catch (error) {
      warn(`Cannot verify table '${table}': ${error.message}`,
        'Check database migrations');
    }
  }
}

async function checkHealthEndpoint() {
  section('5. API Health Check');
  
  try {
    // Check if Next.js app is running
    const response = await makeRequest('http://localhost:3000/api/health', {
      method: 'GET'
    });
    
    if (response.statusCode === 200) {
      pass('Health endpoint responding');
    } else {
      warn('Health endpoint returned non-200 status',
        'API may not be fully configured');
    }
  } catch (error) {
    warn('Health endpoint not accessible',
      'Start the development server with `npm run dev` to test API endpoints');
  }
}

function generateReport() {
  section('📊 Validation Summary');
  
  const percentage = Math.round((healthScore / totalChecks) * 100);
  
  console.log(`${colors.cyan}Overall Health Score:${colors.reset} ${percentage}%`);
  console.log(`${colors.green}Passed:${colors.reset} ${results.passed.length}`);
  console.log(`${colors.yellow}Warnings:${colors.reset} ${results.warnings.length}`);
  console.log(`${colors.red}Failed:${colors.reset} ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log(`\n${colors.red}Critical Issues:${colors.reset}`);
    results.failed.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.message}`);
      if (item.fix) {
        console.log(`   ${colors.cyan}Fix:${colors.reset} ${item.fix}`);
      }
    });
  }
  
  if (results.warnings.length > 0) {
    console.log(`\n${colors.yellow}Warnings (Optional Features):${colors.reset}`);
    results.warnings.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.message}`);
      if (item.note) {
        console.log(`   ${colors.blue}Note:${colors.reset} ${item.note}`);
      }
    });
  }
  
  console.log(`\n${colors.cyan}Recommendations:${colors.reset}`);
  
  if (percentage < 50) {
    console.log(`${colors.red}⚠️  Critical:${colors.reset} System is not ready for production`);
    console.log('   - Fix all failed checks before deploying');
    console.log('   - Ensure Supabase is properly configured');
  } else if (percentage < 80) {
    console.log(`${colors.yellow}⚠️  Warning:${colors.reset} Basic features working, but some optional features missing`);
    console.log('   - Core functionality should work');
    console.log('   - Consider adding optional integrations (OCR, AI) for full features');
  } else {
    console.log(`${colors.green}✅ Good:${colors.reset} System is healthy and ready`);
    console.log('   - All critical checks passed');
    console.log('   - Optional features can be added later');
  }
  
  console.log(`\n${colors.cyan}Next Steps:${colors.reset}`);
  console.log('1. Review and fix any failed checks');
  console.log('2. Run database migrations: Check supabase/migrations/');
  console.log('3. Create storage buckets in Supabase Dashboard');
  console.log('4. Test upload functionality manually');
  console.log('5. Deploy to production when all critical checks pass');
  
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

// Main execution
async function main() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║      Turosa Setup Validation & Health Check   ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // Load environment variables
  loadEnv();
  
  // Run all checks
  await checkEnvironmentVariables();
  await checkSupabaseConnection();
  await checkStorageBuckets();
  await checkDatabaseTables();
  await checkHealthEndpoint();
  
  // Generate report
  generateReport();
  
  // Exit with appropriate code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error(`\n${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
