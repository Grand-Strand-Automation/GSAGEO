import OpenAI from "openai";

const LOG_PREFIX = "[openai:client]";

export type OpenAiEnvStatus = {
  configured: boolean;
  keyPresent: boolean;
  keyLength: number;
  model: string;
  /** True if a NEXT_PUBLIC_ OpenAI key was found (misconfiguration). */
  publicKeyDetected: boolean;
  reason?: string;
};

/**
 * Strip wrapping quotes from Vercel UI pastes / dotenv quirks.
 * Never log the raw value.
 */
export function cleanSecret(value: string | undefined | null): string {
  if (!value) return "";
  let v = value.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

/**
 * Read OpenAI config server-side only.
 * Expected env: OPENAI_API_KEY (required), OPENAI_MODEL (optional, default gpt-4o-mini).
 */
export function getOpenAiEnvStatus(): OpenAiEnvStatus {
  const publicKeyDetected = Boolean(process.env.NEXT_PUBLIC_OPENAI_API_KEY?.trim());
  const cleaned = cleanSecret(process.env.OPENAI_API_KEY);
  const model = cleanSecret(process.env.OPENAI_MODEL) || "gpt-4o-mini";

  if (publicKeyDetected && !cleaned) {
    return {
      configured: false,
      keyPresent: false,
      keyLength: 0,
      model,
      publicKeyDetected: true,
      reason:
        "NEXT_PUBLIC_OPENAI_API_KEY is set but OPENAI_API_KEY is missing — use server-only OPENAI_API_KEY",
    };
  }

  if (!cleaned) {
    return {
      configured: false,
      keyPresent: false,
      keyLength: 0,
      model,
      publicKeyDetected,
      reason: "OPENAI_API_KEY is missing or empty",
    };
  }

  if (cleaned.length < 20) {
    return {
      configured: false,
      keyPresent: true,
      keyLength: cleaned.length,
      model,
      publicKeyDetected,
      reason: "OPENAI_API_KEY looks too short to be valid",
    };
  }

  return {
    configured: true,
    keyPresent: true,
    keyLength: cleaned.length,
    model,
    publicKeyDetected,
  };
}

export function getOpenAiApiKey(): string | null {
  const status = getOpenAiEnvStatus();
  if (!status.configured) return null;
  return cleanSecret(process.env.OPENAI_API_KEY);
}

export function isOpenAiConfigured(): boolean {
  return getOpenAiEnvStatus().configured;
}

export function getOpenAiModel(): string {
  return getOpenAiEnvStatus().model;
}

/** Log once-per-process env diagnostics (no secrets). */
let loggedEnvStatus = false;
export function logOpenAiEnvDiagnostics(force = false): OpenAiEnvStatus {
  const status = getOpenAiEnvStatus();
  if (!loggedEnvStatus || force) {
    loggedEnvStatus = true;
    console.info(LOG_PREFIX, "env status", {
      configured: status.configured,
      keyPresent: status.keyPresent,
      keyLength: status.keyLength,
      model: status.model,
      publicKeyDetected: status.publicKeyDetected,
      reason: status.reason ?? null,
    });
  }
  return status;
}

let cachedClient: OpenAI | null = null;
let fetchOverride: typeof fetch | undefined;

/** Test-only: clear the cached SDK client between cases. */
export function resetOpenAiClientForTests(): void {
  cachedClient = null;
  fetchOverride = undefined;
}

/** Test-only: inject a fetch implementation so unit tests never hit the network. */
export function setOpenAiFetchForTests(fn: typeof fetch | null): void {
  fetchOverride = fn ?? undefined;
  cachedClient = null;
}

/**
 * Server-only OpenAI SDK client. Lazily created and reused.
 * Throws if OPENAI_API_KEY is missing — callers should check isOpenAiConfigured() first.
 */
export function getOpenAiClient(): OpenAI {
  const apiKey = getOpenAiApiKey();
  if (!apiKey) {
    const status = getOpenAiEnvStatus();
    console.error(LOG_PREFIX, "client requested without valid key", {
      reason: status.reason,
      publicKeyDetected: status.publicKeyDetected,
    });
    throw new Error(status.reason ?? "OPENAI_API_KEY not configured");
  }

  if (!cachedClient) {
    cachedClient = new OpenAI({
      apiKey,
      timeout: 35_000,
      maxRetries: 0,
      ...(fetchOverride ? { fetch: fetchOverride } : {}),
    });
  }

  return cachedClient;
}
