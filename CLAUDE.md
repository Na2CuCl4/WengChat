# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # Start dev server (also starts mask:watch)
yarn build        # Production build (standalone mode)
yarn start        # Run production server
yarn lint         # Run ESLint
yarn test         # Run Jest tests (watch mode)
yarn test:ci      # Run Jest tests (CI, single run)
yarn test:cve-2026-7644 # Test the production MCP HTTP security boundary
yarn mask         # Build prompt mask templates
yarn export       # Static export for CDN/static hosting
yarn app:dev      # Tauri desktop app dev mode
yarn app:build    # Tauri desktop app production build
yarn proxy-dev    # Dev server behind a proxy (uses scripts/init-proxy.sh)
```

**Package manager: Yarn** (not npm or bun).

To run a single test file:
```bash
yarn test path/to/file.test.ts
```

## Architecture

### Multi-Provider LLM Pattern

The app proxies requests to 15+ LLM providers: OpenAI, Anthropic, Google, Azure, Baidu, DeepSeek, xAI, Moonshot, Alibaba (Qwen), ByteDance (Doubao), Zhipu (GLM), iFlytek, Tencent, 302AI, SiliconFlow, and OpenAI Responses API.

- **Client-side**: `app/client/api.ts` defines the `ClientApi` abstract interface. Each provider has a concrete implementation in `app/client/platforms/` (e.g., `openai.ts`, `anthropic.ts`). `app/client/controller.ts` (`ChatControllerPool`) manages abort controllers for active streaming requests.
- **Server-side**: `app/api/[provider]/[...path]/route.ts` is the dynamic catch-all API route. Provider-specific auth/request handling lives in `app/api/{provider}.ts`. Shared logic is in `app/api/common.ts`.
- **Data flow**: Chat component → Zustand store → `ClientApi` (platform-specific) → Next.js API route → external LLM API → streaming response → store update → UI re-render.

### State Management (Zustand)

All stores are in `app/store/`. Each uses a custom `createPersistStore()` wrapper (`app/utils/store.ts`) that persists to IndexedDB via `app/utils/indexedDB-storage.ts`.

Key stores:
- `chat.ts` — conversations, messages, MCP tool calls, session management
- `config.ts` — user preferences, model selection, UI settings, theme
- `access.ts` — API keys, access control, auth state
- `mask.ts` — prompt templates ("masks")
- `plugin.ts` — installed plugins and plugin state
- `prompt.ts` — custom user prompts
- `sd.ts` — Stable Diffusion image generation state
- `sync.ts` — cloud sync state (WebDAV / Upstash)
- `update.ts` — app update checking and version state

Access stores via the combined hook from `app/store/index.ts`.

### API Routes

Server routes live in `app/api/`:
- `[provider]/[...path]/route.ts` — dynamic catch-all proxy for all LLM providers
- `config/route.ts` — server config exposed to client at runtime
- `auth.ts` — authentication endpoints
- `proxy.ts` — proxy endpoint
- `webdav/` and `upstash/` — cloud sync backends
- `read_file/` — file reading service proxy (used by `nextchat-readfile` container)
- `mcp/route.ts` — feature-gated, access-code-authenticated MCP operations
- `artifacts/` — artifacts serving
- `health/` — health check endpoint
- `stability.ts` — Stability AI (image generation) endpoint
- `tencent/` — Tencent-specific endpoints

### Key Files

- `app/constant.ts` — central constants file (model lists, provider configs, defaults)
- `app/typing.ts` — shared TypeScript types and interfaces
- `app/utils.ts` — core utilities
- `app/command.ts` — URL-based slash commands (`useCommand` hook: fill, submit, mask, code, settings)
- `app/config/` — config system: `build.ts` (build-time env vars), `client.ts` (client runtime), `server.ts` (server-side env parsing)
- `app/utils/chat.ts` — chat-specific utilities (context compression, token counting)
- `app/utils/sync.ts` — sync logic (Upstash Redis and WebDAV)
- `app/utils/model.ts` — model validation and selection helpers
- `app/utils/stream.ts` — streaming response utilities
- `app/utils/format.ts` — message formatting
- `app/lib/audio.ts` — audio recording/playback utilities
- `app/mcp/` — Model Context Protocol internals and operator-managed local config (`ENABLE_MCP=true` and `CODE` required; no remote server installation)
- `app/masks/` — prompt template definitions (compiled via `yarn mask`)
- `app/locales/` — internationalization: 20+ languages (`cn.ts`, `en.ts`, `jp.ts`, etc.)

### Components

`app/components/chat.tsx` is the main chat UI (~2400 lines). Other key components:
- `home.tsx` — landing page / chat container
- `sidebar.tsx` — conversation sidebar
- `settings.tsx` — settings panel
- `auth.tsx` — auth / access code page
- `mask.tsx` — mask/prompt template browser
- `new-chat.tsx` — new chat creation dialog
- `search-chat.tsx` — chat search
- `model-config.tsx` — model configuration UI
- `exporter.tsx` — chat export
- `markdown.tsx` — markdown rendering (with code highlighting, Mermaid diagrams)
- `plugin.tsx` — plugin management
- `artifacts.tsx` — artifact rendering (code, HTML, SVGs)
- `tts-config.tsx` — text-to-speech configuration
- `emoji.tsx` — emoji picker
- `button.tsx` / `ui-lib.tsx` — shared UI primitives
- `error.tsx` — error boundary / error display

Sub-feature directories:
- `realtime-chat/` — WebSocket-based realtime audio chat
- `sd/` — Stable Diffusion image generation UI
- `voice-print/` — voiceprint / speaker identification
- `sora/` — Sora video generation integration

### Build Modes

Controlled by `BUILD_MODE` env var:
- `standalone` (default) — self-contained Next.js server
- `export` — static export for CDN/static hosting (`yarn export`)

`BUILD_APP=1` enables Tauri desktop app build mode (used with `yarn app:dev` / `yarn app:build`).

### Tauri Desktop App

The `src-tauri/` directory contains a [Tauri](https://tauri.app/) wrapper for building native desktop apps (Windows, macOS, Linux). Configuration is in `src-tauri/tauri.conf.json`.

- `yarn app:dev` — runs Vite dev server + Tauri dev window
- `yarn app:build` — builds the Tauri production bundle

## Local Development Setup

1. Copy `.env.local.example` to `.env.local` (or create it) and add API keys.
2. `yarn install`
3. `yarn dev`

Minimum `.env.local` for Azure deployment:
```
AZURE_API_KEY=...
AZURE_URL=...
AZURE_API_VERSION=2024-12-01-preview
```

## Docker

The `docker-compose.yml` runs two services:
- `wengchat` — the main app (port 3001 locally)
- `nextchat-readfile` — file reading sidecar service (internal port 8000, accessed via `FILE_READING_SERVER` env var)

The production image is `na2cucl4/wengchat:latest`.
