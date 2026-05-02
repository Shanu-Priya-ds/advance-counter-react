# Advanced Counter

A React + TypeScript counter application built with Vite that demonstrates several intermediate React patterns: `useState`, `useRef`, `useEffect`, localStorage persistence, and global keyboard event handling.

## Features

- **Increment / Decrement** — buttons adjust the counter by the configured step value.
- **Configurable step value** — change how much each increment or decrement adds or subtracts.
- **Keyboard shortcuts** — press `ArrowUp` to increment and `ArrowDown` to decrement from anywhere on the page (ignored when an input field has focus).
- **Count history** — every change is recorded and displayed as a running list.
- **LocalStorage persistence** — count, step value, and full history survive page refresh. Writes are debounced by 500 ms to avoid excessive storage calls.
- **Save status indicator** — a status message shows when a save is in progress and when it completes.
- **Reset** — clears the count, history, and the localStorage entry in one click.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI and state management |
| TypeScript | Type safety |
| Vite | Dev server and build tool |
| React Compiler | Automatic memoization |

## Project Structure

```
src/
  components/
    AdvancedCounter.tsx   # Main counter component
  types/
    CountHistory.tsx      # CountHistory and Count interfaces
  App.tsx
  main.tsx
```

## Key Implementation Notes

### `useRef` for stale closure avoidance
Global `keydown`/`keyup` listeners are registered once on mount via `useEffect([], [])`. Because they close over the initial state values, `countRef` and `stepValueRef` are used to give those handlers access to the current count and step value without re-registering the listeners on every change.

### Debounced localStorage writes
A `useEffect` that watches `count` sets a 500 ms timeout before writing to localStorage. The cleanup function clears the timeout, so only the final value in a burst of rapid changes is actually written.

### Immutable history updates
`updateCountInObj` spreads both the top-level `CountHistory` object and the inner `counts` array before appending, ensuring the state update is always a new object reference and React re-renders correctly.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
