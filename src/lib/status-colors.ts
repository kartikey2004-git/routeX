/**
 * Single source of truth for HTTP method / status / connection-state colors.
 * Previously duplicated (and drifted) across request-bar, tab-bar,
 * collection-folder, add-request-modal, response-viewer, and the realtime
 * module — consolidated here so every screen renders the same colors.
 */

const METHOD_COLORS: Record<string, string> = {
  GET: "text-success",
  POST: "text-blue-600 dark:text-blue-400",
  PUT: "text-warning",
  PATCH: "text-violet-600 dark:text-violet-400",
  DELETE: "text-destructive",
};

export function getMethodColor(method: string): string {
  return METHOD_COLORS[method?.toUpperCase()] ?? "text-muted-foreground";
}

export function getStatusColor(status?: number): string {
  if (typeof status !== "number") return "text-muted-foreground";
  if (status >= 200 && status < 300) return "text-success";
  if (status >= 300 && status < 400) return "text-blue-600 dark:text-blue-400";
  if (status >= 400 && status < 500) return "text-warning";
  return "text-destructive";
}

export type ConnectionState =
  | "connected"
  | "connecting"
  | "disconnected"
  | "error";

export function getConnectionColor(state: ConnectionState): string {
  switch (state) {
    case "connected":
      return "text-success";
    case "connecting":
      return "text-warning";
    default:
      return "text-destructive";
  }
}

export function getConnectionDotColor(state: ConnectionState): string {
  switch (state) {
    case "connected":
      return "bg-success";
    case "connecting":
      return "bg-warning";
    default:
      return "bg-destructive";
  }
}
