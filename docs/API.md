# API Documentation

> Internal API patterns and REST endpoints for the ClawClip Node.js / Next.js backend.

## Design Principles

- **Transport**: JSON over HTTP/REST.
- **Routing**: Next.js API Routes (`/api/*`).
- **Data Fetching (Client)**: SWR / React Query for deduplication and caching.

---

## 1. Companies

### `GET /api/companies/:companyId/workforce`

Fetches the complete workforce (humans and AI agents) for a specific company, used to synchronize the 3D office canvas.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| companyId | string | Yes | The unique identifier of the company |

**Response:**
- `200 OK`: Returns combined workforce arrays.
- `404 Not Found`: Company does not exist.

**Example Response:**
```json
{
  "humans": [
    { "id": "h1", "type": "human", "name": "Alice" }
  ],
  "agents": [
    { "id": "a1", "type": "agent", "name": "Documentation Writer" }
  ]
}
```

---

## 2. Kanban Boards

### `POST /api/boards/:boardId/cards`

Creates a new task card on a specific board. Triggered by UI or via the `/task` command in Comms chat.

**Parameters (Body):**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| title | string | Yes | Task title |
| description | string | No | Task details |

**Response:**
- `201 Created`: Card created successfully.

---

*Note: For external LLM API usage, refer to the [AG-Kit MCP Documentation](../ag-kit/README.md).*
