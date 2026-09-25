# MNIX asset catalog

Metadata-only catalog for downloads hosted at https://assets.patproductions.net.
Binary files belong on the asset server, never in Git. Each download is pinned to
a version directory, SHA-256 and measured size. The portfolio fetches directly
with CORS, omits credentials and verifies complete files before use.

`releaseTag` identifies the server version directory. Existing license and source
metadata is retained; owner-requested inclusion is not a verified license grant.
See the portfolio docs/assets.md for upload layout and server configuration.
Run `node scripts/validate.mjs` before committing metadata changes.
