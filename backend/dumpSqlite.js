import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join('./data/nuta.db'); // or absolute path
const dumpPath = path.join('./data/nuta_dump.sql');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    return console.error('❌ Could not open database', err.message);
  }
  console.log('✅ Connected to SQLite database');
});

db.serialize(() => {
  db.each("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
    if (err) console.error(err);
    else console.log('Table:', row.name);
  });
});

// Dump the database
db.serialize(() => {
  db.all("SELECT sql FROM sqlite_master WHERE type='table'", (err, rows) => {
    if (err) return console.error(err);
    const sqlDump = rows.map(r => r.sql).join(';\n') + ';';
    fs.writeFileSync(dumpPath, sqlDump);
    console.log('📄 SQLite dump created at', dumpPath);
  });
});

db.close();
