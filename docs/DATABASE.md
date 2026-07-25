# Database Architecture

> Data storage, schema modeling, and retrieval strategies for ClawClip.

## 1. Technology Stack

- **Primary Database**: Google Cloud Firestore (NoSQL Document Database).
- **Client Access**: Client SDK for real-time listeners.
- **Server Access**: Firebase Admin SDK (`paperclip/server/src/lib/firebase-admin.ts`) for trusted mutations.

## 2. Data Modeling Strategy

- **Denormalization**: Prefer duplicating lightweight data (like `authorName`) over deep joins, given NoSQL constraints.
- **Collections**:
  - `companies/` - Root tenants.
  - `companies/{companyId}/workforce/` - Humans and agents.
  - `boards/` - Kanban board configurations.
  - `boards/{boardId}/cards/` - Task items.
  - `channels/` - Comms group chats.

## 3. Real-time Synchronization

- **Zustand Hydration**: Initial load via server-side or REST API, followed by Firestore `onSnapshot` listeners to keep the UI perfectly synced without manual refetching.
- **Conflict Resolution**: Last-write-wins at the document level. Use Firestore FieldValue array unions for concurrent tags.
