# Sequence Diagram

**Description:** This document illustrates the dataflows between the datastore (JSON file), application logic, and frontend rendering in the Haikus for June application.

## Overview

The application follows a simple request-response pattern with server-side rendering using EJS templates. There is no traditional ORM as data is served directly from a JSON file.

## System Components

- **Client Browser**: User's web browser
- **Express Server**: Node.js web server handling HTTP requests
- **JSON Datastore**: `haikus.json` file containing haiku data
- **EJS View Engine**: Template renderer for HTML generation
- **Static Assets**: Images and CSS served from `/public/`

## Request Flow Diagram

### GET / (View All Haikus)

```mermaid
sequenceDiagram
    participant Client as Client Browser
    participant Express as Express Server
    participant JSON as haikus.json
    participant EJS as EJS View Engine
    participant Static as Static Files
    
    Client->>Express: GET /
    Express->>JSON: Read haikus array
    JSON-->>Express: Return all haikus
    Express->>EJS: Render index.ejs with haikus
    EJS->>Static: Reference image paths
    Static-->>EJS: Image URLs
    EJS-->>Express: Compiled HTML
    Express-->>Client: HTML Response (200)
    Client->>Express: GET /images/*.jpg
    Express->>Static: Serve image files
    Static-->>Client: Image files
    Client->>Express: GET /css/main.css
    Express->>Static: Serve CSS
    Static-->>Client: CSS file
```

### GET /:id (View Single Haiku)

```mermaid
sequenceDiagram
    participant Client as Client Browser
    participant Express as Express Server
    participant JSON as haikus.json
    participant EJS as EJS View Engine
    
    Client->>Express: GET /3
    Express->>JSON: Access haikus[3]
    JSON-->>Express: Return haiku at index 3
    alt Haiku exists
        Express->>EJS: Render index.ejs with [haiku]
        EJS-->>Express: Compiled HTML
        Express-->>Client: HTML Response (200)
    else Haiku not found
        Express-->>Client: Error Response (404)
    end
```

### POST /random (Random Haiku)

```mermaid
sequenceDiagram
    participant Client as Client Browser
    participant Express as Express Server
    participant JSON as haikus.json
    participant EJS as EJS View Engine
    
    Client->>Express: POST /random
    Express->>JSON: Read haikus array
    JSON-->>Express: Return all haikus
    Express->>Express: Generate random index
    Express->>Express: Select haikus[randomIndex]
    Express->>EJS: Render index.ejs with [randomHaiku]
    EJS-->>Express: Compiled HTML
    Express-->>Client: HTML Response (200)
```

## Application Startup Flow

```mermaid
sequenceDiagram
    participant Node as Node.js Runtime
    participant App as index.js
    participant Server as server.js
    participant Express as Express App
    participant JSON as haikus.json
    
    Node->>Server: Execute server.js
    Server->>App: require('./index.js')
    App->>Express: Create Express app
    App->>JSON: require('./haikus.json')
    JSON-->>App: Load haikus into memory
    App->>Express: Configure middleware
    App->>Express: Set view engine to EJS
    App->>Express: Define routes
    App-->>Server: Export app
    Server->>Express: app.listen(port)
    Express-->>Server: Server running
```

## Data Flow Architecture

```mermaid
graph LR
    A[Client Request] --> B[Express Router]
    B --> C{Route Handler}
    C -->|GET /| D[Load All Haikus]
    C -->|GET /:id| E[Load Single Haiku]
    C -->|POST /random| F[Select Random Haiku]
    D --> G[haikus.json]
    E --> G
    F --> G
    G --> H[EJS Template Engine]
    H --> I[Render HTML]
    I --> J[HTTP Response]
    J --> A
    
    style A fill:#e1f5ff
    style G fill:#fff4e1
    style H fill:#f0fff0
    style J fill:#ffe1e1
```

## Static Asset Flow

```mermaid
graph TD
    A[Client] -->|Request HTML| B[Express Server]
    B -->|Return HTML| A
    A -->|Parse HTML| C[Find Asset References]
    C -->|GET /images/*.jpg| B
    C -->|GET /css/main.css| B
    B -->|express.static 'public'| D[Public Directory]
    D -->|Serve Files| B
    B -->|Return Assets| A
    
    style A fill:#e1f5ff
    style D fill:#fff4e1
```

## Key Points

- **No ORM**: Application directly accesses JSON data without an ORM layer
- **In-Memory**: `haikus.json` is loaded once at startup and kept in memory
- **Read-Only**: No write operations to the datastore during runtime
- **Server-Side Rendering**: All HTML is generated server-side using EJS
- **Static Assets**: Images and CSS are served via Express static middleware
