# Testing Strategy

> Automated and manual testing guidelines.

## 1. Unit Testing
- **Framework**: Vitest / Jest.
- **Scope**: Pure functions, Zustand store reducers, and date formatting utilities.
- **Command**: `pnpm test`

## 2. Component Testing
- **Framework**: React Testing Library.
- **Scope**: Individual UI components, ensuring ARIA attributes and accessibility compliance.
- **Focus**: Test user behaviors (clicks, inputs) rather than implementation details (state internals).

## 3. End-to-End (E2E)
- **Framework**: Playwright.
- **Scope**: Critical user flows:
  - Logging in.
  - Opening the Kanban immersive screen.
  - Creating a task.
  - Verifying the task appears in the Comms channel.

## 4. Manual UI Verification
- Ensure the `Canvas` (Three.js) does not block pointer events for the DOM layers.
- Test performance of 3D rendering on mobile/low-end devices.
- Verify `Escape` key closes immersive screens.
