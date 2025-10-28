# API Endpoints

**Description:** Complete documentation of all API endpoints in the Haikus for June application, including their access level, inputs, outputs, and sample calls.

## Base URL

- **Development:** `http://localhost:3000`
- **Production:** Depends on deployment (Azure App Service)

## Endpoints

### 1. Get All Haikus

**Endpoint:** `GET /`

**Access Level:** Public

**Description:** Retrieves and displays all haikus with their associated images.

**Request Parameters:** None

**Response:**
- **Status Code:** 200 OK
- **Content-Type:** text/html
- **Body:** Rendered HTML page with all haikus and images

**Sample Call:**

```bash
curl http://localhost:3000/
```

**Sample Response:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Haikus for June</title>
    <link href="/css/main.css" rel="stylesheet" type="text/css">
    ...
  </head>
  <body>
    <h1>Haikus for June</h1>
    <div>
      <img class="june-images" src="images/adopted.jpg" />
      <div class="haiku-containers">
        <p class="haikus">Pulling on my leash,
To meet my newest best friend,
Every single dog... :-)</p>
      </div>
      <!-- More haikus... -->
    </div>
  </body>
</html>
```

**Use Case:** Homepage displaying all available haikus about June.

---

### 2. Get Haiku by ID

**Endpoint:** `GET /:id`

**Access Level:** Public

**Description:** Retrieves and displays a specific haiku by its array index.

**Request Parameters:**
- `id` (path parameter, integer): The zero-based index of the haiku in the haikus array

**Response (Success):**
- **Status Code:** 200 OK
- **Content-Type:** text/html
- **Body:** Rendered HTML page with the requested haiku and image

**Response (Not Found):**
- **Status Code:** 404 Not Found
- **Content-Type:** text/html
- **Body:** "Haiku not found"

**Sample Call:**

```bash
# Get the first haiku (index 0)
curl http://localhost:3000/0

# Get the third haiku (index 2)
curl http://localhost:3000/2

# Attempt to get non-existent haiku
curl http://localhost:3000/999
```

**Sample Response (Success):**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Haikus for June</title>
    ...
  </head>
  <body>
    <h1>Haikus for June</h1>
    <div>
      <img class="june-images" src="images/adopted.jpg" />
      <div class="haiku-containers">
        <p class="haikus">Pulling on my leash,
To meet my newest best friend,
Every single dog... :-)</p>
      </div>
    </div>
  </body>
</html>
```

**Sample Response (Not Found):**
```
Haiku not found
```

**Use Case:** Direct linking to a specific haiku, sharing individual haikus.

---

### 3. Get Random Haiku

**Endpoint:** `POST /random`

**Access Level:** Public

**Description:** Retrieves and displays a randomly selected haiku from the collection.

**Request Parameters:** None

**Request Headers:**
- `Content-Type`: application/x-www-form-urlencoded (or none needed for empty POST)

**Response:**
- **Status Code:** 200 OK
- **Content-Type:** text/html
- **Body:** Rendered HTML page with a randomly selected haiku and image

**Sample Call:**

```bash
curl -X POST http://localhost:3000/random
```

**JavaScript/Fetch Example:**
```javascript
fetch('http://localhost:3000/random', {
  method: 'POST'
})
  .then(response => response.text())
  .then(html => {
    document.body.innerHTML = html;
  });
```

**Sample Response:**
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Haikus for June</title>
    ...
  </head>
  <body>
    <h1>Haikus for June</h1>
    <div>
      <img class="june-images" src="images/sun.jpg" />
      <div class="haiku-containers">
        <p class="haikus">Busy time at work,
So much to get done today,
Circle back re: naps??</p>
      </div>
    </div>
  </body>
</html>
```

**Use Case:** Displaying a random haiku, "surprise me" feature, daily haiku rotation.

---

## Static Asset Endpoints

### 4. Serve Static Images

**Endpoint:** `GET /images/:filename`

**Access Level:** Public

**Description:** Serves image files from the public/images directory.

**Request Parameters:**
- `filename` (path parameter, string): Name of the image file

**Response:**
- **Status Code:** 200 OK (if file exists), 404 Not Found (if missing)
- **Content-Type:** image/jpeg (or appropriate image MIME type)
- **Body:** Binary image data

**Sample Call:**

```bash
curl http://localhost:3000/images/adopted.jpg --output adopted.jpg
```

---

### 5. Serve CSS

**Endpoint:** `GET /css/:filename`

**Access Level:** Public

**Description:** Serves CSS files from the public/css directory.

**Request Parameters:**
- `filename` (path parameter, string): Name of the CSS file

**Response:**
- **Status Code:** 200 OK (if file exists), 404 Not Found (if missing)
- **Content-Type:** text/css
- **Body:** CSS file content

**Sample Call:**

```bash
curl http://localhost:3000/css/main.css
```

---

## Testing Endpoints

You can test all endpoints using the included test suite:

```bash
npm test
```

Or manually with cURL:

```bash
# Test homepage
curl -i http://localhost:3000/

# Test specific haiku
curl -i http://localhost:3000/0

# Test random haiku
curl -i -X POST http://localhost:3000/random

# Test 404 case
curl -i http://localhost:3000/999
```

## API Summary Table

| Endpoint | Method | Access | Description | Response Type |
|----------|--------|--------|-------------|---------------|
| `/` | GET | Public | Get all haikus | HTML |
| `/:id` | GET | Public | Get haiku by index | HTML or 404 |
| `/random` | POST | Public | Get random haiku | HTML |
| `/images/:filename` | GET | Public | Serve image file | Binary (JPEG/PNG) |
| `/css/:filename` | GET | Public | Serve CSS file | CSS |

## Notes

- All endpoints return server-side rendered HTML (except static assets)
- No authentication or authorization required
- No rate limiting implemented
- CORS not configured (same-origin policy applies)
- All endpoints are **Internal** if used within the application's own frontend, or **Public** if called from external clients
