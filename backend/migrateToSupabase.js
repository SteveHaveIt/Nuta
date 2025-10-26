import sqlite3 from "sqlite3";
import { supabase } from "./src/config/supabase.js";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "data/nuta.db"); 
const sqliteDb = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) return console.error("❌ Could not open SQLite DB:", err.message);
  console.log("✅ Connected to SQLite database");
});

function migrateTable(tableName) {
  return new Promise((resolve, reject) => {
    sqliteDb.all(`SELECT * FROM ${tableName}`, async (err, rows) => {
      if (err) return reject(err);

      for (let row of rows) {
        const { error } = await supabase.from(tableName).insert([row]);
        if (error) console.error(`❌ Error inserting into ${tableName}:`, error);
      }

      console.log(`✅ Migrated table: ${tableName}`);
      resolve();
    });
  });
}

async function migrateAll() {
  const tables = [
    "users", "orders", "products", "order_items", "blog_posts",
    "flash_sales", "affiliates", "affiliate_referrals", "giveaways",
    "giveaway_entries", "marketing_campaigns", "social_contests",
    "contest_submissions", "discount_codes", "discount_usage",
    "subscribers", "notification_queue", "spin_wheel_config", "spin_attempts"
  ];

  for (let table of tables) {
    await migrateTable(table);
  }

  console.log("🎉 Migration complete!");
  sqliteDb.close();
}

migrateAll();
