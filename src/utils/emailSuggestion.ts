/**
 * Suggests a corrected email when the user types a known domain with a typo.
 * Domains are derived from the app's email regex, which allows:
 * gmail.com | hotmail.com/es | outlook.com/es | yahoo.com/es | live.com/es
 */

const ALLOWED_DOMAINS = [
  "gmail.com",
  "hotmail.com",
  "hotmail.es",
  "outlook.com",
  "outlook.es",
  "yahoo.com",
  "yahoo.es",
  "live.com",
  "live.es",
];

/** Levenshtein distance between two strings */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

/**
 * Returns a suggested email if a typo is detected in the domain part.
 * Returns `null` if the email is already valid or has no suggestion.
 */
export function suggestEmail(email: string): string | null {
  const atIndex = email.lastIndexOf("@");
  if (atIndex < 1) return null; // no "@" or "@" at the start

  const local = email.slice(0, atIndex);
  const typedDomain = email.slice(atIndex + 1).toLowerCase();

  if (!typedDomain) return null;

  // Already a valid domain — no suggestion needed
  if (ALLOWED_DOMAINS.includes(typedDomain)) return null;

  // Find the closest allowed domain
  let bestDomain: string | null = null;
  let bestDistance = Infinity;

  for (const domain of ALLOWED_DOMAINS) {
    const dist = levenshtein(typedDomain, domain);
    // Only suggest if the distance is small relative to domain length
    const threshold = Math.max(2, Math.floor(domain.length * 0.4));
    if (dist <= threshold && dist < bestDistance) {
      bestDistance = dist;
      bestDomain = domain;
    }
  }

  if (!bestDomain) return null;
  return `${local}@${bestDomain}`;
}
