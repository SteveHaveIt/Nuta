// migrateDataToSupabase.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Open SQLite database
async function openDb() {
  return open({
    filename: './data/nuta.db',  // <-- path to your SQLite DB
    driver: sqlite3.Database
  });
}

// Migrate a single table
async function migrateTable(tableName) {
  const db = await openDb();
  try {
    const rows = await db.all(`SELECT * FROM ${tableName}`);
    if (rows.length === 0) {
      console.log(`⚠️ No data to migrate for table: ${tableName}`);
      return;
    }

    const { error } = await supabase.from(tableName).insert(rows);
    if (error) {
      console.error(`❌ Error inserting into ${tableName}:`, error);
    } else {
      console.log(`✅ Migrated table: ${tableName}`);
    }
  } catch (err) {
    console.error(`❌ Failed to migrate table ${tableName}:`, err);
  } finally {
    await db.close();
  }
}

// List of tables to migrate (order matters for foreign keys)
const tables = [
  'users',
  'orders',
  'products',
  'order_items',
  'blog_posts',
  'campaign_interactions',
  'flash_sales',
  'affiliates',
  'affiliate_referrals',
  'giveaways',
  'giveaway_entries',
  'marketing_campaigns',
  'social_contests',
  'contest_submissions',
  'discount_codes',
  'discount_usage',
  'subscribers',
  'notification_queue',
  'spin_wheel_config',
  'spin_attempts'
];

async function migrateAll() {
  for (const table of tables) {
    await migrateTable(table);
  }
  console.log('🎉 Migration complete!');
}

migrateAll();
