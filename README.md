
# Haikus for June

This is a quick node project for demoing Workspaces and deployment to Azure App Service using Actions. It is based off of the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world). It's great!!!

![June](https://user-images.githubusercontent.com/2132776/77270618-d139dd00-6c82-11ea-8e01-9ee81f49b937.png)

## Data Storage

This application uses SQLite for data storage. Haiku data is stored in a local `haikus.db` file.

### Database Schema

The `haikus` table has the following structure:
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT): Unique identifier for each haiku
- `text` (TEXT NOT NULL): The haiku text content
- `image` (TEXT NOT NULL): The filename of the associated image

### Database Migration

On first startup, the application automatically migrates data from `haikus.json` to the SQLite database. The migration script (`migrate.js`) can also be run manually:

```bash
node migrate.js
```

### Database Module

The application includes a database module (`db.js`) that provides the following functions:
- `getAllHaikus()`: Retrieves all haikus from the database
- `getHaikuById(id)`: Retrieves a specific haiku by its ID
- `getRandomHaiku()`: Retrieves a random haiku from the database
- `getHaikusCount()`: Returns the total number of haikus in the database
- `closeDb()`: Closes the database connection

### Backward Compatibility

The API maintains backward compatibility with the original JSON-based implementation by supporting both 0-based (legacy) and 1-based (database) IDs when accessing haikus by ID.
