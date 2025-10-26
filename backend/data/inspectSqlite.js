import sqlite3 from 'sqlite3';

const dbPath = 'C:/Users/infos/Desktop/Nuta/home/ubuntu/nuta-ecommerce/backend/data/nuta.db'; // <-- absolute path
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Could not open database', err);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});

// List all tables
db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log('Tables:', rows.map(r => r.name));
    }
    db.close();
});

