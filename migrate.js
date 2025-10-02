const fs = require('fs');
const path = require('path');
const { insertHaiku, getHaikuCount } = require('./db');

// Migration function
function migrate() {
  // Read haikus from JSON file
  const haikusPath = path.join(__dirname, 'haikus.json');
  const haikus = JSON.parse(fs.readFileSync(haikusPath, 'utf8'));

  // Check if database already has data
  const count = getHaikuCount();

  if (count > 0) {
    console.log(`Database already contains ${count} haiku(s). Skipping migration.`);
    console.log('To re-migrate, delete haikus.db and run this script again.');
    return { success: true, skipped: true, count };
  }

  // Migrate haikus to database
  console.log(`Migrating ${haikus.length} haikus to database...`);

  let successCount = 0;
  let failCount = 0;

  haikus.forEach((haiku, index) => {
    try {
      insertHaiku(haiku.text, haiku.image);
      successCount++;
      console.log(`✓ Migrated haiku ${index + 1}/${haikus.length}`);
    } catch (error) {
      failCount++;
      console.error(`✗ Error migrating haiku ${index + 1}:`, error.message);
    }
  });

  const finalCount = getHaikuCount();
  console.log(`\nMigration complete! Database now contains ${finalCount} haiku(s).`);
  
  if (failCount > 0) {
    console.error(`⚠ Warning: ${failCount} haiku(s) failed to migrate.`);
    return { success: false, successCount, failCount, finalCount };
  }
  
  return { success: true, successCount, failCount, finalCount };
}

// Run migration if this file is executed directly
if (require.main === module) {
  const result = migrate();
  if (!result.success && !result.skipped) {
    process.exit(1);
  }
}

module.exports = { migrate };
