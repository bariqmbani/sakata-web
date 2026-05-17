---
name: sakata-product-domain
description: "Product and game-domain guidance for Sa-Kata, an Indonesian word-chain game. Use when Codex needs to make or review product decisions, Indonesian UI copy, menu/profile/history content, game rules, UX scope, roadmap priorities, leaderboard/multiplayer behavior, or terminology such as syllables, consonant digraphs, and diphthongs."
---

# Sa-Kata Product Domain

## Quick Start

Use this skill to keep product decisions aligned with Sa-Kata's identity: a focused Indonesian word-chain game with a retro 8-bit/NES presentation.

Before making product changes:

1. Read `AGENTS.md` for current phase and scope.
2. Read `DESIGN.md` for visual system constraints when the task touches UI.
3. Read `references/product-knowledge.md` for durable product rules, content placement, terminology, and roadmap guidance.

## Decision Rules

- Keep the main menu as a clean title menu; move passive status, stats, and history into `/profil`.
- Prefer immediate game actions over dashboard content on first screen.
- Write all UI text in Indonesian.
- Preserve the solo game loop before adding new modes.
- Treat `Tantangan Harian` and `Lencana` as later content that depends on reliable profile/history/stats data.
- Treat leaderboard and multiplayer as feature families that need data visibility and security decisions before full UI exposure.
- Use "consonant digraph" for `ng`, `ny`, `sy`, `kh`; reserve "diphthong" for vowel pairs `ai`, `au`, `ei`, `oi`.

## Reference

- Product knowledge: `references/product-knowledge.md`
