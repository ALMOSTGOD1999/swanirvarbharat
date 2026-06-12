---
description: Refresh the AdonisJS skill documentation index from the official sitemap.
---

# /adonisjs:update-docs

Refresh `.claude/skills/adonisjs/docs-index.json` from the official AdonisJS documentation sitemap.

## Steps

1. Run the bundled updater from the repository root:

   ```bash
   node .claude/skills/adonisjs/scripts/update-docs-index.js
   ```

2. Confirm that this file was updated:

   ```text
   .claude/skills/adonisjs/docs-index.json
   ```

3. Report a concise summary to the user:
   - sitemap URL used
   - total links discovered
   - valid Markdown docs indexed
   - failed/skipped links, if any
   - output path

## Notes

- The updater uses only built-in Node.js APIs.
- It validates generated `.md` documentation URLs and skips individual failed pages.
- If the sitemap cannot be fetched or the index cannot be written, treat that as a command failure.
