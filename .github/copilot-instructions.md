# Copilot PR Review Instructions

## Project Stack

- **React 19** + **TypeScript ~6.0** + **Vite ~8.0**
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin)
- **Bundler**: `@vitejs/plugin-react` (Oxc transformer)
- **Linting**: `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **No test runner** configured — functional correctness must be assessed from code review alone

---

## Review Priorities

When reviewing a PR, check in this order:

### 1. TypeScript Correctness

The project enforces strict TypeScript. Flag any violation of:

- `noUnusedLocals` / `noUnusedParameters` — unused variables or parameters must be removed, not prefixed with `_`
- `erasableSyntaxOnly` — avoid `const enum`, namespace merging, or other non-erasable syntax
- `noFallthroughCasesInSwitch` — every `case` must have a `break`, `return`, or explicit `// falls through` comment
- Avoid `any` — prefer explicit types or generics
- Props and data-shape interfaces must be defined (not inline or `object`)

### 2. React Patterns

- Prefer named function declarations for components (`function Foo()`) over arrow-function components assigned to `const`
- Sub-components and helper components should be extracted into their own named functions, not defined inline inside JSX
- Never define a component inside another component's render body
- Event handlers should be typed: `React.MouseEvent<HTMLButtonElement>`, `React.ChangeEvent<HTMLInputElement>`, etc.
- `key` props on lists must be stable and unique — avoid using array index as key when items can reorder or be removed
- Always provide `aria-label` or accessible text for icon-only buttons and interactive elements
- Prefer `type="button"` on `<button>` elements to avoid accidental form submission

### 3. Tailwind CSS v4

- Use Tailwind utility classes exclusively — do not mix inline `style={{}}` with Tailwind unless animating dynamic values that cannot be expressed as utilities
- Avoid Tailwind class duplication or conflicting utilities on the same element (e.g., `px-3 px-4`)
- Do not use arbitrary values (e.g., `text-[15px]`) when a standard scale value is close enough
- Responsive variants (`sm:`, `md:`, `lg:`) should follow mobile-first order

### 4. Code Quality

- No magic numbers or magic strings — extract to named constants at the top of the file or a shared constants module
- No commented-out code in the final diff
- No `console.log` / `console.error` left in production code
- Functions should do one thing — flag functions longer than ~40 lines for extraction
- Prefer early returns over deeply nested conditionals

### 5. Component Design

- Data that is fetched or derived should not live as hardcoded arrays inside component files unless it is genuinely static seed data
- Props should not accept more than ~5–6 individual primitive props without grouping them into an interface
- Avoid prop drilling beyond 2 levels — suggest context or co-location instead

### 6. File & Module Conventions

- One default export per file, matching the filename (e.g., `AttractionList.tsx` exports `AttractionList`)
- Helper functions and sub-components used only by one parent should live in the same file as that parent
- Shared types used across multiple files belong in a dedicated `types.ts` or co-located `*.types.ts` file

### 7. Accessibility (a11y)

- Interactive elements must be keyboard-focusable and have visible focus styles
- Images must have meaningful `alt` text (empty `alt=""` only for decorative images)
- Color contrast must be sufficient — flag low-contrast text on colored backgrounds
- Do not rely solely on color to convey meaning

### 8. Performance

- Avoid defining objects or arrays as default prop values inline (they recreate on every render)
- Flag unnecessary re-renders from unstable references passed as props
- Lazy-load heavy components or routes with `React.lazy` where applicable

---

## What NOT to flag

- Formatting and whitespace — this is handled by ESLint/Prettier automatically
- Stylistic preferences with no functional impact (e.g., `&&` vs ternary for simple conditionals)
- Minor naming style differences that are still clear and readable
- Adding comments explaining *what* code does — only flag the absence of a comment when the *why* is non-obvious

---

## Comment Style

When leaving a review comment:

- State the **rule or principle** being violated in the first sentence
- Give a **one-line code suggestion** when the fix is straightforward
- Label severity: `[blocking]` for correctness/type errors, `[warning]` for best-practice deviations, `[nit]` for minor improvements
- Do not leave `[nit]` comments that require blocking before merge

---

## Build Gate

A PR is not mergeable if `npm run build` would fail. This includes:
- TypeScript compile errors
- Unused locals/parameters caught by `tsc`
- ESLint errors (not warnings)
