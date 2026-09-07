/**
 * Read Auth.js / Google env at request time.
 * Dynamic `process.env[name]` avoids Next.js build-time inlining so Vercel
 * runtime secrets work after they are pasted (calendar still builds without them).
 */
function readEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function googleClientId(): string | undefined {
  return readEnv("AUTH_GOOGLE_ID", "GOOGLE_CLIENT_ID");
}

export function googleClientSecret(): string | undefined {
  return readEnv("AUTH_GOOGLE_SECRET", "GOOGLE_CLIENT_SECRET");
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(googleClientId() && googleClientSecret());
}

/**
 * Auth.js requires a secret in production. A placeholder keeps `next build`
 * and `/api/auth/session` alive when AUTH_SECRET is unset. Real Google sign-in
 * still needs a generated AUTH_SECRET on Vercel.
 */
export function authSecret(): string {
  return (
    readEnv("AUTH_SECRET", "NEXTAUTH_SECRET") ||
    "build-placeholder-set-AUTH_SECRET-before-enabling-google-sign-in"
  );
}
