# @ezymap/design-system — MCP server (v2.7.0)

Zero-dependency MCP server over stdio that lets AI agents query the design system:
tokens, components, motion utilities and the asset catalog. No build step, no deps —
plain Node.

## Tools

| Tool | Args | Returns |
|---|---|---|
| `ezymap_summary` | — | name, version, counts, doc pointers |
| `ezymap_tokens` | `group?` (color/spacing/radius/shadow/gradient/motion/breakpoint/type) | token list for a group, or all groups |
| `ezymap_components` | `name?` | component list, or one component's props doc |
| `ezymap_motion` | `file?` | motion stylesheets, or the class list inside one |
| `ezymap_assets` | `kind` (logo/product/motion), `name?`, `variant?`, `format?` | resolved asset paths from the manifest |
| `ezymap_rules` | — | the hard brand/a11y rules agents must follow |

## Register it

```json
{
  "mcpServers": {
    "ezymap-ds": {
      "command": "node",
      "args": ["/path/to/ezymap-design-system/mcp/server.mjs"]
    }
  }
}
```

## CLI equivalent

Everything the server exposes is also available without MCP:

```bash
node scripts/manifest.mjs --product pro --variant glass --format png
node scripts/manifest.mjs --motion
node scripts/manifest.mjs --list
```
