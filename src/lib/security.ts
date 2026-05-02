const CONTROL_CHARS_REGEX = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const CONTROL_CHARS_NO_NEWLINES_REGEX = /[\u0000-\u001F\u007F]/g;
const HTML_TAGS_REGEX = /<[^>]*>/g;
const MULTISPACE_REGEX = /[ \t]+/g;
const MULTI_NEWLINES_REGEX = /\n{3,}/g;

type SanitizeTextOptions = {
  maxLength?: number;
  allowNewLines?: boolean;
  stripHtml?: boolean;
  collapseWhitespace?: boolean;
};

type SanitizeUrlOptions = {
  allowRelativePath?: boolean;
  allowedHostSuffixes?: string[];
  requireHttps?: boolean;
};

export function clampNumber(
  value: unknown,
  min: number,
  max: number,
  fallback = min
): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

export function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback = min
): number {
  const safe = clampNumber(value, min, max, fallback);
  return Math.trunc(safe);
}

export function sanitizeTextInput(value: unknown, options: SanitizeTextOptions = {}): string {
  const {
    maxLength = 120,
    allowNewLines = false,
    stripHtml = true,
    collapseWhitespace = true,
  } = options;

  const raw = typeof value === "string" ? value : "";
  const withoutHtml = stripHtml ? raw.replace(HTML_TAGS_REGEX, " ") : raw;
  const withoutCR = withoutHtml.replace(/\r\n?/g, "\n");
  const withoutControl = allowNewLines
    ? withoutCR.replace(CONTROL_CHARS_REGEX, "")
    : withoutCR.replace(CONTROL_CHARS_NO_NEWLINES_REGEX, " ");

  const normalized = collapseWhitespace
    ? withoutControl
        .replace(MULTISPACE_REGEX, " ")
        .replace(MULTI_NEWLINES_REGEX, "\n\n")
        .trim()
    : withoutControl.trim();

  return normalized.slice(0, Math.max(0, maxLength));
}

export function sanitizePhoneNumber(
  value: unknown,
  options: { minDigits?: number; maxDigits?: number } = {}
): string {
  const { minDigits = 8, maxDigits = 15 } = options;
  const digits = typeof value === "string" ? value.replace(/\D/g, "") : "";

  if (digits.length < minDigits || digits.length > maxDigits) {
    return "";
  }

  return digits;
}

export function sanitizeExternalUrl(
  value: unknown,
  options: SanitizeUrlOptions = {}
): string | null {
  const {
    allowRelativePath = false,
    allowedHostSuffixes,
    requireHttps = false,
  } = options;

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (allowRelativePath) {
    const isSafeRelativePath =
      trimmed.startsWith("/") && !trimmed.startsWith("//");

    if (isSafeRelativePath) {
      return trimmed;
    }
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  const protocol = parsed.protocol.toLowerCase();
  if (requireHttps) {
    if (protocol !== "https:") {
      return null;
    }
  } else if (protocol !== "https:" && protocol !== "http:") {
    return null;
  }

  if (allowedHostSuffixes && allowedHostSuffixes.length > 0) {
    const host = parsed.hostname.toLowerCase();
    const allowed = allowedHostSuffixes.some((suffix) => {
      const safeSuffix = suffix.toLowerCase();
      return host === safeSuffix || host.endsWith(`.${safeSuffix}`);
    });

    if (!allowed) {
      return null;
    }
  }

  return parsed.toString();
}

export function sanitizeMapEmbedUrl(value: unknown): string | null {
  const safe = sanitizeExternalUrl(value, {
    requireHttps: true,
    allowedHostSuffixes: ["google.com"],
  });

  if (!safe) {
    return null;
  }

  const parsed = new URL(safe);
  const path = parsed.pathname.toLowerCase();
  const output = parsed.searchParams.get("output")?.toLowerCase() ?? "";
  const hasMapsPath = path.includes("/maps");

  if (!hasMapsPath && output !== "embed") {
    return null;
  }

  return parsed.toString();
}

export function sanitizeSocialUrl(value: unknown, network: "instagram" | "facebook" | "tiktok") {
  const allowedHosts = {
    instagram: ["instagram.com"],
    facebook: ["facebook.com", "fb.com"],
    tiktok: ["tiktok.com"],
  } as const;

  return sanitizeExternalUrl(value, {
    requireHttps: true,
    allowedHostSuffixes: [...allowedHosts[network], "www." + allowedHosts[network][0]],
  });
}
