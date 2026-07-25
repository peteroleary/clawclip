# Data Schema

> TypeScript interfaces and Zod validation schemas for core data types.

## 1. Core Entities

### 1.1 Workforce Member
```typescript
interface Workforce3DMember {
  id: string;
  type: "human" | "agent";
  name: string;
  role: string;
  avatarUrl?: string;
  departmentId?: string;
  position?: { x: number; y: number; z: number };
}
```

### 1.2 Kanban Task Card
```typescript
interface TaskCard {
  id: string;
  boardId: string;
  columnId: "todo" | "in_progress" | "review" | "done";
  title: string;
  description?: string;
  assigneeIds: string[];
  dueDate?: string; // ISO 8601
  createdAt: number; // Unix timestamp
}
```

### 1.3 Chat Channel
```typescript
interface Channel {
  id: string;
  name: string; // e.g., "#dept-engineering"
  type: "group" | "dm";
  linkedEntityId?: string; // Links back to a board or project
}
```

## 2. Validation Rules
- All IDs must be strictly alphanumeric with underscores (e.g., `proj_clawclip`).
- Timestamps should be standardized as Unix epochs for database storage, and formatted on the client.
