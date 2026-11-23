/**
 * Turns an AI request failure into a message the user can act on.
 * Raw provider text (model names, quota details) stays in the console.
 */
export function describeAiError(error: unknown, action: string): string {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  const text = raw.toLowerCase();

  if (error instanceof DOMException && error.name === "AbortError") {
    return `${action} took too long. Try again.`;
  }
  if (text.includes("aborted") || text.includes("timeout") || text.includes("timed out")) {
    return `${action} took too long. Try again.`;
  }
  if (text.includes("high demand") || text.includes("overloaded") || text.includes("503")) {
    return "The AI service is busy right now. Try again in a minute.";
  }
  if (text.includes("no longer available") || text.includes("not found")) {
    return "The AI model isn't available. The app needs an update.";
  }
  if (text.includes("prompt is required")) {
    return "Describe what you need first.";
  }
  if (text.includes("fetch") || text.includes("network")) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return `${action} failed. Try again.`;
}
