const Database = require('./database/Database');
const haikus = require('./haikus.json');

async function migrate() {
  const db = new Database();
  
  try {
    console.log('Initializing database...');
    await db.init();
    
    console.log('Migrating haikus from JSON to SQLite...');
    
    // Check if data already exists
    const existingHaikus = await db.getAllHaikus();
    if (existingHaikus.length > 0) {
      console.log(`Database already contains ${existingHaikus.length} haikus. Skipping migration.`);
      return;
    }
    
    // Insert each haiku from JSON
    let migrated = 0;
    for (const haiku of haikus) {
      await db.insertHaiku(haiku.text, haiku.image);
      migrated++;
      const textPreview = haiku.text ? haiku.text.substring(0, 30) : 'No text';
      console.log(`Migrated haiku ${migrated}/${haikus.length}: "${textPreview}..."`);
    }
    
    console.log(`Successfully migrated ${migrated} haikus to SQLite!`);
    
    // Verify migration
    const allHaikus = await db.getAllHaikus();
    console.log(`Database now contains ${allHaikus.length} haikus.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate();
}

module.exports = migrate;