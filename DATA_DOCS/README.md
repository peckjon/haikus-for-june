# Data Documentation

This directory contains comprehensive documentation of the data flows and structures in the Haikus for June application.

## Documentation Files

### 📊 [data-flow-diagram.md](./data-flow-diagram.md)
Visual Mermaid diagrams showing:
- High-level data flow from Frontend to Backend
- Sequence diagrams for each API endpoint
- Component architecture overview

**Best for:** Understanding how data moves through the system and the interaction patterns between components.

### 📝 [data-definitions.md](./data-definitions.md)
Detailed definitions including:
- Data structure specifications (Haiku object, arrays)
- API endpoint documentation
- Request/response formats
- Error handling
- Environment variables

**Best for:** Reference guide for developers implementing or integrating with the API.

## Quick Overview

### Application Architecture

The Haikus for June application is a simple Node.js web application with the following architecture:

```
Frontend (Browser) ←→ Backend (Express) ←→ Data (haikus.json)
```

### Data Flow

1. **User** navigates to the website
2. **Browser** sends HTTP request to Express server
3. **Express** routes the request to appropriate handler
4. **Handler** reads data from `haikus.json`
5. **EJS** template renders HTML with the data
6. **Express** sends HTML response back to browser
7. **Browser** displays the page to the user

### Key Endpoints

- `GET /` - Display all haikus
- `GET /:id` - Display a specific haiku by index
- `POST /random` - Display a random haiku

### Data Model

```json
{
  "text": "Haiku text with\nline breaks for proper\nformatting",
  "image": "image-filename.jpg"
}
```

## How to Use This Documentation

1. **New to the project?** Start with [data-flow-diagram.md](./data-flow-diagram.md) to understand the system architecture
2. **Integrating with the API?** Reference [data-definitions.md](./data-definitions.md) for endpoint specifications
3. **Debugging data issues?** Follow the sequence diagrams in [data-flow-diagram.md](./data-flow-diagram.md)
4. **Adding new features?** Review both documents to understand existing patterns

## Visual Reference

The diagrams in this documentation were created following the pattern shown in the issue requirements, showing:
- Data stores (databases/files)
- User interactions
- System components
- Data flow directions
- Processing steps

All diagrams use Mermaid syntax and can be viewed directly on GitHub or in any Mermaid-compatible viewer.
