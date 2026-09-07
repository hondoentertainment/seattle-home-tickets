/** Google OAuth + Auth.js env helpers. No secrets are returned. */

export function googleClientId(): string | undefined {
  return process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || undefined;
}

export function googleClientSecret(): string | undefined {
  return process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || undefined;
}

export function isGoogleAuthConfigured(): boolean {
  return Boolean(googleClientId() && googleClientSecret());
}

/** Auth.js requires a secret in production. A placeholder keeps `next build` green. */
export function authSecret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "build-placeholder-set-AUTH_SECRET-before-enabling-google-sign-in"
  );
}
