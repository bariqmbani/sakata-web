---
name: sakata-technical-architecture
description: "Technical architecture guidance for Sa-Kata Web. Use when Codex needs to implement or review React routes, hooks, services, Firebase Auth/Firestore/Realtime Database data flow, solo game persistence, profile/history queries, syllable-engine integration, validation, security rules, tests, or build/lint/typecheck workflows."
---

# Sa-Kata Technical Architecture

## Quick Start

Use this skill for implementation and review work in `sakata-web`.

Before changing code:

1. Read `AGENTS.md` for project constraints and phase scope.
2. Read `references/technical-knowledge.md` for current architecture, data flow, and verification expectations.
3. Read `DESIGN.md` when a technical change affects layout or components.

## Implementation Rules

- Keep the app client-side only: React 19 + Vite + React Router.
- Use Firebase for auth, persistence, real-time sync, and later presence.
- Use the syllable engine package through `src/lib/syllable.ts`; never duplicate syllable parsing rules.
- Keep Firebase access in services and subscriptions in hooks.
- Use strict TypeScript with named exports, type imports, and no `any`.
- Add focused tests for shared rule/report/data logic.
- Preserve user changes and avoid unrelated formatting churn.

## Reference

- Technical knowledge: `references/technical-knowledge.md`
