// Holyship API connection
export const HOLYSHIP_API_URL = process.env.HOLYSHIP_API_URL ?? "http://localhost:3001";
export const HOLYSHIP_API_TOKEN = process.env.HOLYSHIP_API_TOKEN ?? "";
// Browser-side WebSocket URL — must be set to the publicly reachable WS endpoint
export const HOLYSHIP_WS_URL = process.env.NEXT_PUBLIC_HOLYSHIP_WS_URL ?? "";
// Browser-side WS token — separate from server-side HOLYSHIP_API_TOKEN
export const HOLYSHIP_WS_TOKEN = process.env.NEXT_PUBLIC_HOLYSHIP_WS_TOKEN ?? "";
export const GITHUB_BASE_URL = "https://github.com/";
export const LINEAR_BASE_URL = `https://linear.app/${process.env.LINEAR_ORG ?? "wopr"}/issue/`;
export const SOURCES_CONFIG_PATH = process.env.SOURCES_CONFIG_PATH ?? "./holyship.sources.json";
export const WORKTREE_BASE = process.env.WORKTREE_BASE ?? "/tmp/holyship-worktrees";
export const HOLYSHIP_REPO_PATH = process.env.HOLYSHIP_REPO_PATH ?? "";
export function requireHolyshipRepoPath(): string {
  if (!process.env.HOLYSHIP_REPO_PATH) {
    throw new Error("HOLYSHIP_REPO_PATH environment variable is required");
  }
  return process.env.HOLYSHIP_REPO_PATH;
}

// Single-tenant ID (engine uses "default" in production)
export const WOPR_TENANT_ID = process.env.TENANT_ID ?? process.env.WOPR_TENANT_ID ?? "default";

// GitHub App OAuth
export const GITHUB_APP_ID = process.env.GITHUB_APP_ID ?? "";
export const GITHUB_APP_CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID ?? "";
export const GITHUB_APP_CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET ?? "";
export const GITHUB_APP_INSTALL_URL = process.env.GITHUB_APP_INSTALL_URL ?? "";

// Linear OAuth
export const LINEAR_CLIENT_ID = process.env.LINEAR_CLIENT_ID ?? "";
export const LINEAR_CLIENT_SECRET = process.env.LINEAR_CLIENT_SECRET ?? "";
export const APP_URL = process.env.APP_URL ?? "http://localhost:3000";
