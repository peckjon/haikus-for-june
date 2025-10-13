# Data Flow Diagram

This diagram shows the data flows between the Frontend (Browser/Client) and Backend (Express Server) in the Haikus for June application.

## High-Level System Overview

```mermaid
graph TB
    %% External Components
    Browser[Browser/Client]
    User[External User]
    
    %% Frontend Components
    EJS[EJS Template Engine]
    HTML[Rendered HTML Page]
    
    %% Backend Components
    Express[Express Server]
    Routes[Route Handlers]
    DataStore[(haikus.json)]
    StaticFiles[/Static Files\nImages & CSS/]
    
    %% User Interactions
    User -->|1. Navigate to URL| Browser
    User -->|2. Click Links| Browser
    User -->|3. Submit Forms| Browser
    
    %% Frontend to Backend Requests
    Browser -->|GET /| Express
    Browser -->|GET /:id| Express
    Browser -->|POST /random| Express
    Browser -->|Request Static Assets| StaticFiles
    
    %% Backend Processing
    Express -->|Route Request| Routes
    Routes -->|Read All Haikus| DataStore
    Routes -->|Read Haiku by ID| DataStore
    Routes -->|Select Random Haiku| DataStore
    
    %% Response Flow
    Routes -->|Render Template with Data| EJS
    DataStore -->|Haiku Data Array| Routes
    EJS -->|Generate HTML| HTML
    HTML -->|HTTP Response| Browser
    StaticFiles -->|Images/CSS Files| Browser
    
    %% Display to User
    Browser -->|Display Content| User
    
    style Browser fill:#e1f5ff
    style Express fill:#fff3e0
    style DataStore fill:#f3e5f5
    style EJS fill:#e8f5e9
    style User fill:#c8e6c9
```

## Detailed Data Flow Sequences

### Sequence 1: Load All Haikus (GET /)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Express
    participant Routes
    participant DataStore
    participant EJS
    
    User->>Browser: Navigate to homepage
    Browser->>Express: GET /
    Express->>Routes: Handle GET /
    Routes->>DataStore: Read haikus.json
    DataStore-->>Routes: Return haikus array
    Routes->>EJS: Render index.ejs with {haikus: haikus}
    EJS-->>Express: Generated HTML
    Express-->>Browser: HTTP 200 + HTML
    Browser->>Browser: Request static assets (CSS, images)
    Browser->>Express: GET /css/main.css
    Express-->>Browser: CSS file
    Browser->>Express: GET /images/{image}
    Express-->>Browser: Image files
    Browser-->>User: Display all haikus with images
```

### Sequence 2: Load Single Haiku by ID (GET /:id)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Express
    participant Routes
    participant DataStore
    participant EJS
    
    User->>Browser: Click link or enter URL with ID
    Browser->>Express: GET /:id
    Express->>Routes: Handle GET /:id
    Routes->>DataStore: Access haikus[id]
    alt Haiku exists
        DataStore-->>Routes: Return haiku object
        Routes->>EJS: Render index.ejs with {haikus: [haiku]}
        EJS-->>Express: Generated HTML
        Express-->>Browser: HTTP 200 + HTML
        Browser-->>User: Display single haiku
    else Haiku not found
        Routes-->>Express: Send 404 error
        Express-->>Browser: HTTP 404 + "Haiku not found"
        Browser-->>User: Display error message
    end
```

### Sequence 3: Get Random Haiku (POST /random)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Express
    participant Routes
    participant DataStore
    participant EJS
    
    User->>Browser: Submit form or trigger POST
    Browser->>Express: POST /random
    Express->>Routes: Handle POST /random
    Routes->>DataStore: Access haikus array
    DataStore-->>Routes: Return all haikus
    Routes->>Routes: Calculate random index
    Routes->>DataStore: Access haikus[randomIndex]
    DataStore-->>Routes: Return random haiku
    Routes->>EJS: Render index.ejs with {haikus: [randomHaiku]}
    EJS-->>Express: Generated HTML
    Express-->>Browser: HTTP 200 + HTML
    Browser-->>User: Display random haiku
```

## Component Architecture

```mermaid
graph LR
    subgraph Frontend
        A[Browser/Client]
        B[HTML/CSS/Images]
    end
    
    subgraph Backend
        C[Express Server]
        D[Route Handlers]
        E[EJS Template Engine]
        F[(haikus.json)]
        G[Public Directory]
    end
    
    A <-->|HTTP Requests/Responses| C
    C --> D
    D --> F
    D --> E
    E --> D
    G -->|Static Files| A
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style F fill:#f3e5f5
    style E fill:#e8f5e9
```
