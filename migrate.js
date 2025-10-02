const fs = require('fs');
const path = require('path');
const { insertHaiku, getHaikuCount } = require('./db');

// Read haikus from JSON file
const haikusPath = path.join(__dirname, 'haikus.json');
const haikus = JSON.parse(fs.readFileSync(haikusPath, 'utf8'));

// Check if database already has data
const count = getHaikuCount();

if (count > 0) {
  console.log(`Database already contains ${count} haiku(s). Skipping migration.`);
  console.log('To re-migrate, delete haikus.db and run this script again.');
  process.exit(0);
}

// Migrate haikus to database
console.log(`Migrating ${haikus.length} haikus to database...`);

haikus.forEach((haiku, index) => {
  try {
    insertHaiku(haiku.text, haiku.image);
    console.log(`✓ Migrated haiku ${index + 1}/${haikus.length}`);
  } catch (error) {
    console.error(`✗ Error migrating haiku ${index + 1}:`, error.message);
  }
});

const finalCount = getHaikuCount();
console.log(`\nMigration complete! Database now contains ${finalCount} haiku(s).`);
