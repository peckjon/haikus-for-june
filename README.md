
# Haikus for June

This is a quick node project for demoing Workspaces and deployment to Azure App Service using Actions. It is based off of the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world). It's great!!!

![June](https://user-images.githubusercontent.com/2132776/77270618-d139dd00-6c82-11ea-8e01-9ee81f49b937.png)

## Database

This application uses SQLite to store haikus. The database is managed using [better-sqlite3](https://github.com/WiseLibs/better-sqlite3), a lightweight and fast SQLite3 library for Node.js.

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the migration script to populate the database with haikus:
   ```bash
   node migrate.js
   ```

   This will create a `haikus.db` file and import all haikus from `haikus.json`.

### Running the Application

Start the server:
```bash
npm start
```

The server will run on port 3000 (or the port specified in the `PORT` environment variable).

### API Endpoints

- `GET /` - Display all haikus
- `GET /:id` - Display a specific haiku by ID
- `POST /random` - Display a random haiku

### Database Schema

The `haikus` table has the following structure:

```sql
CREATE TABLE haikus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  image TEXT NOT NULL
)
```

### Development

Run tests:
```bash
npm test
```

Watch mode for tests:
```bash
npm run testwatch
```

