
# Haikus for June

This is a quick node project for demoing Workspaces and deployment to Azure App Service using Actions. It is based off of the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world). It's great!!!

![June](https://user-images.githubusercontent.com/2132776/77270618-d139dd00-6c82-11ea-8e01-9ee81f49b937.png)

## Database

The application uses SQLite to store haiku data. The database is automatically created and populated from `haikus.json` when the application starts for the first time.

### Database Schema

The `haikus` table has the following structure:

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT) - Unique identifier for each haiku
- `text` (TEXT NOT NULL) - The haiku text content
- `image` (TEXT NOT NULL) - The image filename associated with the haiku

### Database Layer

The `db.js` module provides a data access layer with the following functions:

- `getAllHaikus()` - Returns all haikus from the database
- `getHaikuById(id)` - Returns a specific haiku by its ID
- `getRandomHaiku()` - Returns a random haiku
- `getHaikusCount()` - Returns the total count of haikus

The database file (`haikus.db`) is automatically generated on first run and is excluded from version control.
