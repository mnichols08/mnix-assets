export const ASSET_REPOSITORY = "mnichols08/mnix-assets";
export const hostingAuthorized = (asset) => asset.redistributable === true ||
  (asset.redistributable === false && asset.distributionAuthorization === "owner-requested-existing-collection" &&
   asset.authorizationDate && asset.sourceUrl && asset.legalNotes);
export function validateAssets(manifest) {
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.assets))
    throw new Error(
      "Asset catalog must use schemaVersion 1 and an assets array.",
    );
  const ids = new Set();
  for (const asset of manifest.assets) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(asset.id) || ids.has(asset.id))
      throw new Error(`Invalid or duplicate asset ID: ${asset.id}`);
    ids.add(asset.id);
    for (const key of [
      "name",
      "platform",
      "category",
      "version",
      "description",
      "license",
      "legalNotes",
    ])
      if (typeof asset[key] !== "string" || !asset[key].trim())
        throw new Error(`Missing ${key}: ${asset.id}`);
    if (
      !["hosted", "external-download", "user-supplied"].includes(
        asset.distributionMode,
      ) ||
      typeof asset.enabled !== "boolean" ||
      typeof asset.redistributable !== "boolean" ||
      (asset.browserFetch !== undefined &&
        typeof asset.browserFetch !== "boolean")
    )
      throw new Error(`Invalid distribution metadata: ${asset.id}`);
    if (asset.downloadUrl) {
      const url = new URL(asset.downloadUrl);
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.hash ||
        url.search
      )
        throw new Error(`Invalid asset URL: ${asset.id}`);
    }
    if (asset.distributionMode === "user-supplied" && asset.downloadUrl)
      throw new Error(
        `User-supplied assets cannot have downloads: ${asset.id}`,
      );
    if (
      asset.enabled &&
      asset.distributionMode !== "user-supplied" &&
      !asset.downloadUrl
    )
      throw new Error(`Missing download URL: ${asset.id}`);
    if (asset.distributionMode === "hosted") {
      if (
        !hostingAuthorized(asset) ||
        !asset.licenseSource ||
        !/^[a-f0-9]{64}$/.test(asset.sha256) ||
        !Number.isSafeInteger(asset.sizeBytes) ||
        asset.sizeBytes <= 0
      )
        throw new Error(
          `Hosted asset needs verified rights, source, checksum and size: ${asset.id}`,
        );
      if (
        asset.downloadUrl &&
        (!/^[a-zA-Z0-9._-]+$/.test(asset.releaseTag) ||
          !new RegExp(
            `^https://github\\.com/${ASSET_REPOSITORY}/releases/download/${asset.releaseTag.replace(/\./g, "\\.")}/[a-zA-Z0-9._-]+$`,
          ).test(asset.downloadUrl))
      )
        throw new Error(
          `Hosted asset must use its pinned GitHub release: ${asset.id}`,
        );
    }
    if (
      asset.browserFetch &&
      (asset.distributionMode !== "hosted" || !asset.downloadUrl)
    )
      throw new Error(`Browser fetch requires a hosted release: ${asset.id}`);
  }
  return manifest;
}
