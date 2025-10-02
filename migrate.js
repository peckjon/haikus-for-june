const fs = require('fs');
const path = require('path');
const { insertHaiku, getHaikuCount } = require('./db');

// Migration function
function migrate() {
  try {
    // Read haikus from JSON file
    const haikusPath = path.join(__dirname, 'haikus.json');
    
    if (!fs.existsSync(haikusPath)) {
      console.error(`Error: haikus.json file not found at ${haikusPath}`);
      return { success: false, error: 'File not found' };
    }
    
    const haikusData = fs.readFileSync(haikusPath, 'utf8');
    let haikus;
    
    try {
      haikus = JSON.parse(haikusData);
    } catch (parseError) {
      console.error('Error: Failed to parse haikus.json:', parseError.message);
      return { success: false, error: 'Invalid JSON' };
    }

    // Check if database already has data
    let count;
    try {
      count = getHaikuCount();
    } catch (dbError) {
      console.error('Error: Failed to query database:', dbError.message);
      return { success: false, error: 'Database query failed' };
    }

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

    let finalCount;
    try {
      finalCount = getHaikuCount();
    } catch (dbError) {
      console.error('Error: Failed to get final count from database:', dbError.message);
      return { success: false, successCount, failCount, error: 'Database query failed' };
    }
    
    console.log(`\nMigration complete! Database now contains ${finalCount} haiku(s).`);
    
    if (failCount > 0) {
      console.error(`⚠ Warning: ${failCount} haiku(s) failed to migrate.`);
      return { success: false, successCount, failCount, finalCount };
    }
    
    return { success: true, successCount, failCount, finalCount };
  } catch (error) {
    console.error('Unexpected error during migration:', error.message);
    return { success: false, error: error.message };
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  const result = migrate();
  if (!result.success && !result.skipped) {
    process.exit(1);
  }
}

module.exports = { migrate };
