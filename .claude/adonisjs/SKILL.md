---
name: adonisjs
description: Use this skill when implementing, reviewing, debugging, or refactoring AdonisJS v7 applications. Trigger it whenever the user mentions AdonisJS, Adonis, adonisrc, Ace commands, Lucid ORM, Adonis auth, Adonis middleware/controllers/validators/providers, or when the repository/package appears to be an AdonisJS project via adonisrc.ts, ace.js, or @adonisjs/* dependencies. This skill keeps agents aligned with official AdonisJS conventions by looking up current docs from docs.adonisjs.com Markdown pages on demand.
---

# AdonisJS v7 Skill

Use this skill to keep AdonisJS v7 implementation and review work aligned with the framework's official conventions instead of generic Node.js or Express-style patterns.

## When to use

Use this skill when any of these are true:

- The user explicitly mentions AdonisJS, Adonis, Ace, Lucid, `adonisrc`, Adonis auth, or Adonis providers.
- The task touches AdonisJS routing, controllers, middleware, validators, models, services, config, providers, events, mail, queues, auth, authorization, tests, or Ace commands.
- The repo or package looks like an AdonisJS project. Check for:
  - `adonisrc.ts`
  - `ace.js`
  - `@adonisjs/*` dependencies in `package.json`
- In monorepos, check package-local `package.json`, `adonisrc.ts`, and `ace.js` files before assuming the whole workspace is or is not AdonisJS.

This skill is written for AdonisJS v7. If a project has `@adonisjs/core` pinned to an older major version, call that out before giving version-specific guidance and fetch the docs most relevant to the installed version when available. Do not silently apply v7-only assumptions to older apps.

## Core workflow

1. Detect whether the current task is in an AdonisJS app/package.
2. Identify the relevant AdonisJS topic: routing, controllers, Lucid, validation, auth, providers, tests, etc.
3. Search `docs-index.json` for matching official docs pages.
4. Fetch the corresponding `mdUrl` pages on demand when framework behavior or conventions matter.
5. Implement or review using official AdonisJS v7 guidance and the local project's existing conventions.

Do not store or assume a complete local copy of the docs. `docs-index.json` is only a lightweight index; fetch the current `.md` docs page when needed.

## Documentation lookup

The docs index lives at:

```text
.claude/skills/adonisjs/docs-index.json
```

Each page entry includes:

- `title`
- `url`
- `mdUrl`
- `category`
- `path`
- `status`

When you need docs:

1. Read or search `docs-index.json` for likely topic matches.
2. Fetch the selected page's `mdUrl`.
3. Prefer the official doc wording over memory for framework-specific behavior.
4. Mention the relevant doc topic when it helps the user understand the recommendation.

The AdonisJS docs site exposes agent-readable Markdown by appending `.md` to docs URLs.

## Implementation guidance

Prefer AdonisJS v7 conventions over generic Node.js patterns:

- Use Adonis routing, controllers, middleware, validators, services, and providers in their intended roles.
- Keep framework bootstrapping, config, and provider code consistent with Adonis conventions.
- Use Lucid ORM patterns for models, relationships, queries, migrations, factories, and seeders instead of ad hoc database access unless the project deliberately does otherwise.
- Use Adonis validation patterns for request input instead of scattering validation logic through controllers.
- Follow Adonis auth and authorization primitives when authentication or access control is involved.
- **Always use `node ace` commands to generate stub files** instead of creating them manually. This ensures correct imports, naming conventions, and file placement. Common generators include:
  - `node ace make:controller` — for HTTP controllers
  - `node ace make:model` — for Lucid models
  - `node ace make:migration` — for database migrations
  - `node ace make:validator` — for request validators
  - `node ace make:middleware` — for HTTP middleware
  - `node ace make:service` — for application services
  - `node ace make:factory` — for model factories
  - `node ace make:seeder` — for database seeders
  - `node ace make:provider` — for custom providers
  - `node ace make:command` — for custom Ace commands
  - `node ace make:event` — for event classes
  - `node ace make:listener` — for event listeners
  - Run `node ace list` to discover all available commands in the current project.
- Use Ace commands for database workflows:
  - `node ace migration:run` — apply pending migrations
  - `node ace migration:rollback` — rollback the last batch
  - `node ace migration:status` — check migration status
  - `node ace db:seed` — run database seeders
  - `node ace db:wipe` — truncate/drop all tables (usually in test setup)
- Follow v7 environment and config conventions:
  - Validate environment variables in `start/env.ts` using `env.createValidator()` and `env.get()`.
  - Keep config files in `config/*.ts` and use `defineConfig()` helpers where the framework provides them.
  - Read environment values only through validated config/env abstractions, never directly from `process.env` in application code.
- Use Adonis testing conventions and project-local test helpers for HTTP, database, and integration tests.
- Preserve the existing app's naming, folder structure, and dependency injection style unless official docs or the user's request justify changing it.
- Do not manually edit auto-generated framework files:
  - `.adonisjs/*` — auto-generated; do not create, edit, or commit these.
  - `database/schema.ts` — auto-generated from migrations; do not edit by hand.

Before making framework-specific decisions, fetch the relevant docs page when any of these apply:

- The API shape may have changed in v7.
- The task involves auth, middleware, providers, validation, Lucid relationships, transactions, testing, or deployment.
- You are unsure whether an approach is idiomatic AdonisJS.
- The change may affect upgradeability or long-term maintainability.

## Review guidance

Use a balanced convention policy:

- Enforce core AdonisJS conventions when deviations risk correctness, maintainability, or upgradeability.
- Prefer docs-backed recommendations for framework behavior.
- Allow pragmatic exceptions when the project has an explicit, reasonable reason.
- Avoid forcing style-only changes that are not grounded in Adonis docs or local project conventions.
- When flagging an issue, explain the AdonisJS convention and suggest a concrete fix.

Review common risk areas carefully:

- Controllers doing too much work that belongs in services, validators, middleware, or models.
- Generic Express/Koa assumptions leaking into Adonis code.
- Direct environment reads where config files should mediate values.
- Lucid models, migrations, relationships, and serializers that do not match documented patterns.
- Auth or middleware code that bypasses framework mechanisms.
- Tests that do not use Adonis test utilities or app lifecycle correctly.

## Updating the docs index

Use the bundled command guidance in:

```text
.claude/skills/adonisjs/commands/update-docs.md
```

The updater script is:

```text
.claude/skills/adonisjs/scripts/update-docs-index.js
```

Run it with:

```bash
node .claude/skills/adonisjs/scripts/update-docs-index.js
```

The script uses only built-in Node.js APIs. It fetches `https://docs.adonisjs.com/sitemap.xml`, generates `.md` URLs, validates them, extracts titles/categories, and refreshes `docs-index.json`.

## Practical examples

User asks: "Add a password reset flow to this Adonis app."

- Detect Adonis project markers.
- Look up auth, mail, routing/controllers, validation, and testing docs.
- Implement with Adonis primitives and local project conventions.

User asks: "Review this Lucid model."

- Look up Lucid model/relationship docs if needed.
- Check relationships, column decorators, serialization, query scopes, and migrations against documented patterns.
- Flag only meaningful convention or correctness issues.

User asks: "Create a new CRUD resource."

- Use `node ace make:controller`, `node ace make:model`, and `node ace make:migration` to generate stubs.
- Follow Adonis routing conventions, use request validators for input validation, and keep business logic in services or models.
- Write feature tests using Adonis test utilities and the project's test bootstrap.

User asks: "Set up a new database table and model."

- Use `node ace make:model <Name> -m` to generate the model and a matching migration.
- Define the schema in the migration using the latest documented Lucid schema builder API.
- Configure the model with decorators (`@column`, computed properties, etc.) and relationships as documented.
- Run `node ace migration:run` to apply the migration.

User asks: "Update the Adonis docs index."

- Follow `commands/update-docs.md` and run the bundled updater.
