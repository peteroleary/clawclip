# Incident Runbook

> Protocols for debugging and emergency response in the ClawClip environment.

## 1. Outage Protocols

### 1.1 WebGL Context Lost
**Symptom**: The 3D canvas goes black or throws `WebGL context lost` in the browser console.
**Action**:
1. Check if the user is running hardware acceleration in their browser.
2. If memory leak suspected, profile using Chrome DevTools MCP.
3. Fallback to `window.location.reload()` if state becomes irrecoverable.

### 1.2 Firestore Disconnect
**Symptom**: Real-time chats or boards fail to update.
**Action**:
1. Verify Firebase status page.
2. Check `FirebaseError: missing or insufficient permissions`. If so, audit `firestore.rules`.
3. Check offline cache persistence limits.

## 2. Debugging Next.js
- **Logs**: Run `pnpm dev` and monitor terminal for hydration errors.
- **Hydration Mismatch**: Usually caused by rendering `window` or `localStorage` data directly in the initial React pass without a `useEffect` wrapper.
