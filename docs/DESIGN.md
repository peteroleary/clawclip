# System Design

> UX Patterns, component design tokens, and frontend guidelines for ClawClip.

## 1. UI Architecture

- **Immersive Screens**: To avoid nested dialog fatigue, major features (Boards, Comms, Directory, Discover) launch as full-screen modal overlays taking over the entire 3D space, blurring the background.
- **Glassmorphism**: Use translucent panels to maintain connection with the underlying 3D environment (`bg-slate-900/90 backdrop-blur-md`).

## 2. Component Design

### 2.1 Buttons
- **Action Buttons**: Solid backgrounds (`bg-amber-600 hover:bg-amber-500`) with inner shadows.
- **Ghost Buttons**: Used for secondary actions (Cancel, Close) with subtle hover backgrounds (`hover:bg-slate-800`).

### 2.2 Layout
- **Dock**: Centered horizontally at the bottom of the screen. Absolute/fixed positioning.
- **Forms**: Forms should be clean, vertically stacked with `<label>` tags above `<input>` fields, rounded edges (`rounded-xl`), and clear focus rings (`focus:border-amber-500`).

## 3. Accessibility (a11y)
- **Contrast**: Ensure text on dark backgrounds exceeds WCAG AA standards.
- **Keyboard Navigation**: Immersive screens must close on `Escape` key.
- **Semantics**: Use appropriate HTML5 tags (`<nav>`, `<main>`, `<button>`).
