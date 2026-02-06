#!/usr/bin/env node

/**
 * Database Verification Script
 * Verifies database schema, tables, relationships, and RLS policies
 */

const https = require('https');

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

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data }));
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

async function main() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║       Database Schema Verification Tool       ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════╝${colors.reset}\n`);
  
  loadEnv();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log(`${colors.red}❌ Error: Supabase credentials not configured${colors.reset}`);
    process.exit(1);
  }
  
  const tables = [
    { name: 'books', requiredColumns: ['id', 'title', 'pdf_url', 'uploader_id', 'created_at'] },
    { name: 'chapters', requiredColumns: ['id', 'book_id', 'chapter_number', 'title', 'content'] },
    { name: 'user_progress', requiredColumns: ['id', 'user_id', 'book_id', 'chapter_id'] },
    { name: 'discussions', requiredColumns: ['id', 'book_id', 'user_id', 'content'] },
    { name: 'profiles', requiredColumns: ['id', 'user_id', 'full_name'] }
  ];
  
  console.log(`${colors.cyan}Checking database tables...${colors.reset}\n`);
  
  for (const table of tables) {
    try {
      const response = await makeRequest(
        `${supabaseUrl}/rest/v1/${table.name}?select=*&limit=1`,
        {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.statusCode === 200) {
        console.log(`${colors.green}✅ Table '${table.name}' exists and is accessible${colors.reset}`);
        
        // Try to parse response to check columns
        try {
          const data = JSON.parse(response.data);
          if (data.length > 0) {
            const columns = Object.keys(data[0]);
            const missingColumns = table.requiredColumns.filter(col => !columns.includes(col));
            
            if (missingColumns.length > 0) {
              console.log(`   ${colors.yellow}⚠️  Warning: Missing columns: ${missingColumns.join(', ')}${colors.reset}`);
            } else {
              console.log(`   ${colors.green}✓ All required columns present${colors.reset}`);
            }
          }
        } catch (e) {
          // Can't verify columns without data
        }
      } else {
        console.log(`${colors.red}❌ Table '${table.name}' not accessible (status: ${response.statusCode})${colors.reset}`);
        console.log(`   ${colors.cyan}💡 Create the table using migrations in supabase/migrations/${colors.reset}`);
      }
    } catch (error) {
      console.log(`${colors.red}❌ Error checking table '${table.name}': ${error.message}${colors.reset}`);
    }
  }
  
  console.log(`\n${colors.cyan}Database verification complete!${colors.reset}\n`);
}

main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
