# Iframed Editor Demos

Companion plugin for the article/video on the iframed post editor changes landing in **WordPress 7.1**. Every demo block exists in a **broken** and a **fixed** version so you can see exactly what the iframe changes break in custom blocks — and how to fix it.

## The timeline

| Version | Behavior |
| --- | --- |
| WordPress 6.9 | Console warning (with `SCRIPT_DEBUG`) for blocks registered with `apiVersion` ≤ 2. `block.json` schema only validates `apiVersion: 3`. |
| WordPress 7.0 | Only blocks **inserted in the post** are checked (previously all *registered* blocks). All inserted blocks v3+ → editor is iframed. Insert one v2 block → iframe removed. Not enforced. |
| Gutenberg 22.6+ | Iframe **enforced** for block *and* classic themes. |
| WordPress 7.1 | Iframe **enforced for block themes**, regardless of `apiVersion`. All themes in a future release. |

## The demos

| Block | What it shows |
| --- | --- |
| 🕰️ **Legacy API v2 Block** | Inserting it in WP 7.0 removes the iframe from the editor. Logs a deprecation warning in 6.9+ with `SCRIPT_DEBUG`. |
| ❌/✅ **Canvas Width** | Broken: reads `window.innerWidth` from the global (admin) window — wrong number, never updates with the canvas. Fixed: `element.ownerDocument.defaultView` via `useRefEffect`. Toggle Tablet/Mobile preview to compare. |
| ❌/✅ **Click Outside** | Broken: "close dropdown on outside click" bound to the global `document` — canvas clicks never reach it (admin clicks do — enjoy the weirdness). Fixed: listener on `element.ownerDocument`. |
| **Editor Styles Demo** | Two banners: green from `editorStyle` in `block.json` (injected into the iframe — survives), red from `enqueue_block_editor_assets` (admin page only — vanishes when iframed). Count the banners to know where you are. |
| ❌/✅ **Third-Party Library** | Broken: a legacy lib resolves a selector against the global `document` — finds nothing inside the iframe, silently no-ops. Fixed: the lib is "patched" (the `patch-package` technique) to resolve the document from an element. |

## The demo script

1. Create a new post, insert the **Editor Styles Demo** and both **Canvas Width** blocks.
2. On WP 7.0 with a classic theme (no Gutenberg plugin): everything is iframed, red banner missing, broken width block lies to you.
3. Insert the **Legacy API v2 Block** → the editor de-iframes. The red banner appears, the broken blocks start "working" again. This is the backward-compatibility behavior that goes away.
4. Activate the Gutenberg plugin (22.6+) or WP 7.1 + block theme → iframe is enforced; the v2 block no longer rescues anything.
5. Walk the broken/fixed pairs one at a time.

## Setup

```bash
npm install
npm run build
```

Run it with wp-env:

```bash
npx wp-env start                      # WP latest, plugin active, SCRIPT_DEBUG on
```

To test with the iframe **enforced** everywhere (Gutenberg 22.6+), copy the override file and restart:

```bash
cp .wp-env.override.example.json .wp-env.override.json
npx wp-env start --update
```

Or use the Playground blueprint in `_playground/blueprint.json` (requires a release zip on GitHub — see the URL inside).

## References

- [Iframed Editor Changes in WordPress 7.0](https://make.wordpress.org/core/2026/02/24/iframed-editor-changes-in-wordpress-7-0/)
- [Roadmap to 7.1](https://make.wordpress.org/core/2026/06/19/roadmap-to-7-1/)
- [Preparing the Post Editor for Full iframe Integration](https://make.wordpress.org/core/2025/11/12/preparing-the-post-editor-for-full-iframe-integration/)
- [Migrating Blocks for iframe Editor Compatibility](https://developer.wordpress.org/block-editor/reference-guides/block-api/block-api-versions/block-migration-for-iframe-editor-compatibility/)
