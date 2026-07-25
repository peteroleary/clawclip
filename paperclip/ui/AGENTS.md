# Module Contract — Paperclip UI (`paperclip/ui`)

Parent DOX: [AGENTS.md](../../AGENTS.md)

## Scope & Responsibility

This subtree contains the web interface for the ClawClip 3D Office platform, powered by `@paperclipai/ui`.

- **Primary Entry**: [src/pages/Office.tsx](file:///Users/peter/Desktop/clawclip/paperclip/ui/src/pages/Office.tsx)
- **3D Canvas**: Integrates Three.js isometric office canvas with edge-to-edge overlay.
- **Dock**: [src/features/office/components/BottomActionDock.tsx](file:///Users/peter/Desktop/clawclip/paperclip/ui/src/features/office/components/BottomActionDock.tsx)
- **State Management**: [src/store/officeStore.ts](file:///Users/peter/Desktop/clawclip/paperclip/ui/src/store/officeStore.ts) using Zustand (`activePanels`, `focusedBoardId`, `focusedChannelId`).

## Immersive Screens Architecture

All domain tools launch into full-screen immersive interfaces mounted in `Office.tsx`:
1. `WalletImmersiveScreen.tsx` — ATM Treasury, ledger spend, card & crypto management.
2. `TeamImmersiveScreen.tsx` — Org chart, departments, human staff, AI agents, swarms, and troops.
3. `TargetsImmersiveScreen.tsx` — Goals, KPIs, AI diagnostic insights, and action items.
4. `ProjectsImmersiveScreen.tsx` — Strategic projects catalog and progress meters.
5. `KanbanImmersiveScreen.tsx` — Multi-board Kanban with drag-and-drop, master board mirroring, task comments, and due dates.
6. `SchedulingImmersiveScreen.tsx` — Routines and recurring calendar events.
7. `FacilitiesImmersiveScreen.tsx` — Spatial floorplans, furniture, physical objects, and 21 scaled facility presets.
8. `DirectoryImmersiveScreen.tsx` — Universal contact directory (People, Clients, Customers, Contractors, Employees, Vendors, Suppliers).
9. `MemoryImmersiveScreen.tsx` — Persistent agent knowledge entries, company notes, and LLM API keys.
10. `ArtifactsImmersiveScreen.tsx` — Generated files, docs, media images, and videos.
11. `CommsImmersiveScreen.tsx` — Interlinked group chats and direct messages.

## Interlinked Action Cascades Guidelines

- Actions taken on Kanban boards (creating/moving tasks) post automated activity notifications to the entity's group chat channel.
- Typing `/task <title>` in group chat automatically creates a task card on that entity's board.
- Every entity card (Department, Team, Swarm, Project) must render 📊 **Open Board** and 💬 **Open Chat** jump buttons.
