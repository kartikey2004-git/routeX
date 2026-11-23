const METHOD_COLORS: Record<string, string> = {
  GET: "text-success",
  POST: "text-info",
  PUT: "text-warning",
  PATCH: "text-method-patch",
  DELETE: "text-destructive",
};

export function getMethodColor(method: string): string {
  return METHOD_COLORS[method?.toUpperCase()] ?? "text-muted-foreground";
}

export function getStatusColor(status?: number): string {
  if (typeof status !== "number") return "text-muted-foreground";
  if (status >= 200 && status < 300) return "text-success";
  if (status >= 300 && status < 400) return "text-info";
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
