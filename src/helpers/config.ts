/**
 * Version lookup map.
 * Build and DB Version stay the same for all updates within a major version.
 * Update this when a new major version is released.
 */
export const VERSION_CONFIG: Record<string, { build: string; dbVersion: string }> = {
  "9": { build: "v9.0_20260108.2", dbVersion: "23.201.0092" },
  "8": { build: "v8.0_20251107.1", dbVersion: "" },
};

export function getBuildForVersion(majorVersion: string): string {
  return VERSION_CONFIG[majorVersion]?.build ?? "";
}

export function getDbVersionForVersion(majorVersion: string): string {
  return VERSION_CONFIG[majorVersion]?.dbVersion ?? "";
}
