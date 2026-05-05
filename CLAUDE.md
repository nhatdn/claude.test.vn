# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with HMR
npm run build      # Type-check + production build (tsc -b && vite build)
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

No test runner is configured in this project.

## Stack

- **React 19** + **TypeScript** (~6.0) + **Vite** (~8.0)
- Bundler: `@vitejs/plugin-react` (uses Oxc transformer)
- Linting: `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`

## TypeScript strictness

`tsconfig.app.json` enables `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, and `noFallthroughCasesInSwitch`. All must pass before `npm run build` succeeds.

## ESLint

Config in [eslint.config.js](eslint.config.js) uses flat config format. Currently uses `tseslint.configs.recommended` (not type-aware). To enable type-aware rules, add `parserOptions.project` pointing to `tsconfig.node.json` and `tsconfig.app.json` and switch to `tseslint.configs.recommendedTypeChecked`.
