# Data Definitions

This document provides detailed definitions of all data structures and entities used in the Haikus for June application.

## Data Structures

### Haiku Object

Represents a single haiku with its associated image.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Yes | The haiku text content. Can include line breaks (`\n`) for proper formatting. May contain emojis or special characters. |
| `image` | string | Yes | The filename of the image associated with this haiku. Images are stored in the `public/images/` directory. |

**Example:**
```json
{
  "text": "Pulling on my leash,\nTo meet my newest best friend,\nEvery single dog... :-)",
  "image": "adopted.jpg"
}
```

**Validation Rules:**
- `text`: Non-empty string
- `image`: Valid filename pointing to an existing image in `public/images/`

### Haikus Array

The main data structure stored in `haikus.json`. An array of Haiku objects.

**Type:** `Array<Haiku>`

**Location:** `./haikus.json` (root directory)

**Example:**
```json
[
  {
    "text": "Pulling on my leash,\nTo meet my newest best friend,\nEvery single dog... :-)",
    "image": "adopted.jpg"
  },
  {
    "text": "Busy time at work,\nSo much to get done today,\nCircle back re: naps??",
    "image": "sun.jpg"
  }
]
```

**Indexing:** 
- Array is zero-indexed
- Valid indices: `0` to `haikus.length - 1`
- Accessing invalid index returns `undefined`

## API Endpoints

### GET /

**Description:** Retrieves and displays all haikus.

**Request:**
- Method: `GET`
- URL: `/`
- Headers: Standard HTTP headers
- Body: None

**Response:**
- Status Code: `200 OK`
- Content-Type: `text/html`
- Body: Rendered HTML page containing all haikus with their images

**Data Flow:**
1. Server reads entire `haikus.json` file
2. Passes `{haikus: haikus}` to EJS template
3. Template iterates through all haikus and renders each one

**Example Usage:**
```bash
curl http://localhost:3000/
```

---

### GET /:id

**Description:** Retrieves and displays a specific haiku by its array index.

**Request:**
- Method: `GET`
- URL: `/:id`
- URL Parameters:
  - `id` (string/number): The zero-based index of the haiku in the array
- Headers: Standard HTTP headers
- Body: None

**Response (Success):**
- Status Code: `200 OK`
- Content-Type: `text/html`
- Body: Rendered HTML page containing the requested haiku

**Response (Not Found):**
- Status Code: `404 Not Found`
- Content-Type: `text/html`
- Body: "Haiku not found"

**Data Flow:**
1. Server extracts `id` from URL parameters
2. Accesses `haikus[id]` from the array
3. If found: Passes `{haikus: [haiku]}` to EJS template (single-element array)
4. If not found: Returns 404 error

**Example Usage:**
```bash
# Get first haiku (index 0)
curl http://localhost:3000/0

# Get third haiku (index 2)
curl http://localhost:3000/2

# Invalid index
curl http://localhost:3000/999  # Returns 404
```

**Validation:**
- Index must be within bounds: `0 <= id < haikus.length`
- Non-numeric IDs will attempt conversion (JavaScript coercion)

---

### POST /random

**Description:** Retrieves and displays a randomly selected haiku.

**Request:**
- Method: `POST`
- URL: `/random`
- Headers: Standard HTTP headers
- Body: None (no request body required)

**Response:**
- Status Code: `200 OK`
- Content-Type: `text/html`
- Body: Rendered HTML page containing a randomly selected haiku

**Data Flow:**
1. Server generates random index: `Math.floor(Math.random() * haikus.length)`
2. Accesses `haikus[randomIndex]` from the array
3. Passes `{haikus: [randomHaiku]}` to EJS template (single-element array)

**Example Usage:**
```bash
curl -X POST http://localhost:3000/random
```

**Randomization:**
- Uses JavaScript's `Math.random()` function
- Uniform distribution across all haikus
- Each request is independent (no state maintained)

---

## Template Data

### EJS Template Context

The `index.ejs` template receives the following data context:

| Variable | Type | Description |
|----------|------|-------------|
| `haikus` | Array<Haiku> | Array of haiku objects to render. Can contain one or all haikus depending on the route. |

**Usage in Template:**
```ejs
<% for(var i=0; i < haikus.length; i++) { %>
  <img src="images/<%= haikus[i].image %>" />
  <p><%- haikus[i].text %></p>
<% } %>
```

**Note:** The template uses `<%=` for escaped output (image filename) and `<%-` for unescaped output (haiku text with HTML formatting).

---

## Static Assets

### Images

**Location:** `public/images/`

**Referenced by:** Haiku objects' `image` field

**Supported formats:** JPG, PNG, and other web-compatible image formats

**Access:** Served statically via Express at `/images/{filename}`

**Examples:**
- `adopted.jpg`
- `sun.jpg`
- `pillow.jpg`
- `blanket.jpg`
- `visitor.jpg`
- `sunlight.jpg`

### CSS

**Location:** `public/css/main.css`

**Access:** Served statically via Express at `/css/main.css`

**Referenced by:** EJS template's `<link>` tag

---

## Error Responses

### 404 Not Found

**Trigger:** Accessing a haiku with an invalid ID (GET /:id with out-of-bounds index)

**Response:**
- Status Code: `404`
- Content-Type: `text/html`
- Body: `"Haiku not found"`

**Example:**
```bash
curl -i http://localhost:3000/999
# HTTP/1.1 404 Not Found
# Haiku not found
```

---

## Environment Variables

### PORT

**Description:** The port number on which the Express server listens.

**Type:** Number

**Default:** `3000`

**Usage:**
```bash
PORT=8080 node server.js
```

**Data Flow:** Read from `process.env.PORT` at server startup.

---

## File System Structure

```
haikus-for-june/
├── haikus.json              # Data store (Array<Haiku>)
├── index.js                 # Express app with routes
├── server.js                # Server entry point
├── public/
│   ├── css/
│   │   └── main.css        # Stylesheet
│   └── images/
│       ├── adopted.jpg     # Haiku images
│       ├── sun.jpg
│       ├── pillow.jpg
│       ├── blanket.jpg
│       ├── visitor.jpg
│       └── sunlight.jpg
└── views/
    └── index.ejs           # Template receiving {haikus: Array<Haiku>}
```

---

## Data Flow Summary

1. **Data Source:** `haikus.json` (persistent JSON file)
2. **Data Loading:** Loaded once at server startup via `require()`
3. **Data Access:** Read-only access through route handlers
4. **Data Transform:** Selected/filtered by route logic
5. **Data Rendering:** Passed to EJS template engine
6. **Data Display:** Rendered as HTML and sent to browser
7. **Static Assets:** Served directly from `public/` directory

**Note:** This is a read-only application. No data modifications occur at runtime.
