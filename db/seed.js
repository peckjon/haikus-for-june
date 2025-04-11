const fs = require('fs');
const path = require('path');
const db = require('./database');

async function seedDatabase() {
  try {
    // Check if database already has data
    const haikuCount = await db.countHaikus();
    if (haikuCount > 0) {
      console.log(`Database already contains ${haikuCount} haikus. Skipping seeding.`);
      return;
    }

    // Read haikus from JSON file
    const haikuJsonPath = path.join(__dirname, '..', 'haikus.json');
    console.log(`Reading haikus from: ${haikuJsonPath}`);
    
    if (!fs.existsSync(haikuJsonPath)) {
      throw new Error(`Haiku JSON file not found at: ${haikuJsonPath}`);
    }
    
    const haikuData = JSON.parse(
      fs.readFileSync(haikuJsonPath, 'utf8')
    );

    console.log(`Found ${haikuData.length} haikus in JSON file.`);

    // Insert each haiku into the database
    for (const haiku of haikuData) {
      await db.addHaiku(haiku.text, haiku.image);
      console.log(`Added haiku: "${haiku.text.substring(0, 20)}..."`);
    }

    console.log('Database seeding completed successfully.');
    return { success: true, count: haikuData.length };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error; // Re-throw to ensure calling code knows there was a problem
  }
}

// Run the seeding function if this script is called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('Seeding process finished.');
      db.closeDb();
    })
    .catch(err => {
      console.error('Error in seeding process:', err);
      db.closeDb();
      process.exit(1);
    });
}

module.exports = seedDatabase;

// Run the seeding function
seedDatabase()
  .then(() => {
    console.log('Seeding process finished.');
    // Don't close the db connection right after seeding if this script is imported elsewhere
    if (require.main === module) {
      setTimeout(() => {
        db.closeDb();
        console.log('Database connection closed after seeding.');
      }, 1000); // Give a second for any pending operations to complete
    }
  })
  .catch(err => {
    console.error('Error in seeding process:', err);
    process.exit(1);
  });

module.exports = seedDatabase;
