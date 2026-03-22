/**
 * Ambient type declarations for the WebMCP API (Chrome 146+ DevTrial).
 * Mirrors @wopr-network/platform-ui-core/src/types/web-mcp.d.ts
 */

interface ModelContextTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (params: Record<string, unknown>) => Promise<unknown>;
}

interface ModelContext {
  registerTool(tool: ModelContextTool): void;
}

interface Navigator {
  modelContext?: ModelContext;
}
