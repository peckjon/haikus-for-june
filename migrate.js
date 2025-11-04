const db = require('./db');
const haikusData = require('./haikus.json');
const fs = require('fs');
const path = require('path');

// Migration script to populate SQLite database from haikus.json
function migrate() {
  console.log('Starting migration from haikus.json to SQLite...');
  
  // Check if database already has data
  const count = db.getHaikusCount();
  if (count > 0) {
    console.log(`Database already contains ${count} haikus. Skipping migration.`);
    return;
  }
  
  // Insert all haikus from JSON
  console.log(`Migrating ${haikusData.length} haikus...`);
  haikusData.forEach((haiku, index) => {
    db.addHaiku(haiku.text, haiku.image);
  });
  
  console.log('Migration completed successfully!');
  console.log(`Total haikus in database: ${db.getHaikusCount()}`);
}

// Run migration if this file is executed directly
if (require.main === module) {
  try {
    migrate();
    db.closeDb();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

module.exports = { migrate };
