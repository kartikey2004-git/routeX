export function safeCallbackUrl(
  value: string | string[] | undefined,
  fallback = "/app",
): string {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return fallback;
  }
  return candidate;
}
