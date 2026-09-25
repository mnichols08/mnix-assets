# mnix-assets

Metadata, licensing records and checksums for downloads used by mnix.dev. The portfolio source lives in a separate repository. This repository is its `assets/catalog` Git submodule.

**Large downloadable binaries belong in GitHub Releases, not in Git history.** Only metadata, schema, validation code, documentation and license information are committed here. Releases contain the exact packages and prepared emulator disks. No blanket repository license overrides component licenses.

## Current collection

`emulator-assets-v1` preserves the existing 20-game arcade, original archives, source/utility ZIPs, boot disk and existing Windows guest images. `manifest.json` pins each asset's release URL, SHA-256 and measured size. `checksums.txt` provides a compact inventory.

`redistributable: true` identifies previously reviewed redistributable packages. Other existing games and guest images retain `redistributable: false` and `distributionAuthorization: owner-requested-existing-collection`; these are included at the owner's explicit request, not marked license-verified. Educational use is not a permission grant. Inclusion does not imply ownership. Original sources, licenses, and legal notes remain in each entry.

## Downloads and browser play

Manual links download directly from GitHub Releases. GitHub release responses blocked browser cross-origin reads in testing. The portfolio therefore uses a same-origin Netlify relay restricted to this manifest, fetching bounded 1 MiB ranges. The browser checks the complete SHA-256 before installing or booting. No token or arbitrary upstream URL is accepted from visitors. `browserFetch: true` means enabled through that relay, not a claim that GitHub supports direct browser CORS.

## Publishing updates

1. Review exact bytes, redistribution status, component licenses and corresponding source obligations.
2. Upload binaries to a **new versioned release**, never to Git. Keep local uploads in an ignored directory.
3. Record measured size and SHA-256 in the manifest and checksums file. Never silently replace an existing asset.
4. Run `node scripts/validate.mjs`, commit metadata, and publish the release.
5. Update the portfolio submodule pointer, run asset sync and validation, and smoke-test downloads/play.

The GitHub workflow rejects committed binary packages. New assets without verified rights should normally be external-download or user-supplied; the existing collection's owner authorization is explicit and must not be mistaken for verification.
