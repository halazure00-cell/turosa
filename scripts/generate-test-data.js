#!/usr/bin/env node

/**
 * Generate Test Data Script
 * Creates sample data for development and testing
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

// Sample Arabic text for testing
const sampleArabicText = `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ

هذا نص تجريبي لاختبار نظام الكتب الرقمية.`;

const sampleBooks = [
  {
    title: 'Fathul Qarib (Test)',
    author: 'Imam Nawawi',
    category: 'Fiqih',
    description: 'Test book for development - Kitab Fiqih',
    pdf_url: 'https://example.com/test-book.pdf'
  },
  {
    title: 'Safinatun Najah (Test)',
    author: 'Syekh Salim bin Sumair',
    category: 'Fiqih',
    description: 'Test book for development - Kitab Fiqih Dasar',
    pdf_url: 'https://example.com/test-book-2.pdf'
  }
];

const sampleChapters = [
  {
    chapter_number: 1,
    title: 'Bab Thaharah',
    content: sampleArabicText,
    page_number: 1
  },
  {
    chapter_number: 2,
    title: 'Bab Shalat',
    content: sampleArabicText,
    page_number: 5
  },
  {
    chapter_number: 3,
    title: 'Bab Zakat',
    content: sampleArabicText,
    page_number: 12
  }
];

async function main() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║           Test Data Generator Tool            ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════╝${colors.reset}\n`);
  
  loadEnv();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log(`${colors.red}❌ Error: Supabase credentials not configured${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`${colors.yellow}⚠️  WARNING: This will create test data in your database${colors.reset}`);
  console.log(`${colors.cyan}Test data is marked with '(Test)' in the title${colors.reset}\n`);
  
  console.log(`${colors.cyan}Sample data to be created:${colors.reset}`);
  console.log(`  - ${sampleBooks.length} test books`);
  console.log(`  - ${sampleChapters.length} chapters per book`);
  console.log(`  - Sample Arabic text content\n`);
  
  console.log(`${colors.green}To generate test data:${colors.reset}`);
  console.log(`1. Ensure you're logged in to the application`);
  console.log(`2. Use the upload interface to create books`);
  console.log(`3. Use the digitization feature to create chapters\n`);
  
  console.log(`${colors.yellow}To clear test data:${colors.reset}`);
  console.log(`- Run SQL in Supabase: DELETE FROM books WHERE title LIKE '%(Test)%';\n`);
  
  console.log(`${colors.cyan}Sample Books:${colors.reset}\n`);
  sampleBooks.forEach((book, index) => {
    console.log(`${index + 1}. ${colors.green}${book.title}${colors.reset}`);
    console.log(`   Author: ${book.author}`);
    console.log(`   Category: ${book.category}\n`);
  });
  
  console.log(`${colors.cyan}Note:${colors.reset} This is a reference script.`);
  console.log(`Use the application's UI to create actual test data,`);
  console.log(`or extend this script to make direct API calls.\n`);
}

main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
