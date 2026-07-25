# ClawClip 3D Office OS

A spatial, immersive 3D operating system for unifying human and AI workforces.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server (UI)
cd paperclip
pnpm dev
```

## Features

- 🏢 **3D Isometric Office**: Visualize your team, facilities, and agents in real-time.
- 🤖 **AI Agent Integration**: Hire, deploy, and chat with AI agents via the AG-Kit backend.
- 📊 **Immersive Screens**: 10+ full-screen apps including Kanban Boards, Comms, Directory, and Discovery Marketplace.
- 🔗 **Interlinked Systems**: Actions on a board cascade into group chats automatically.

## Configuration

Local environment variables are stored in `paperclip/.env.local` (ignored by git).

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase config for the client |
| `FIREBASE_PROJECT_ID` | Project ID for Admin SDK |
| `ANTHROPIC_API_KEY` | For agent reasoning |

## Documentation Directory

- [API Reference](./API.md)
- [Architecture](./ARCHITECTURE.md)
- [Design & UI](./DESIGN.md)
- [Database Model](./DATABASE.md)
- [Deployment](./DEPLOY.md)

## License
MIT
