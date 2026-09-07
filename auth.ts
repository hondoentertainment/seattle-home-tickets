import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authSecret, googleClientId, googleClientSecret } from "@/lib/auth-env";

export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  const clientId = googleClientId();
  const clientSecret = googleClientSecret();

  return {
    trustHost: true,
    secret: authSecret(),
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    providers:
      clientId && clientSecret
        ? [
            Google({
              clientId,
              clientSecret,
            }),
          ]
        : [],
    callbacks: {
      jwt({ token, account, profile }) {
        if (account?.provider === "google") {
          const sub = typeof profile?.sub === "string" ? profile.sub : token.sub;
          if (typeof sub === "string" && sub) token.googleSub = sub;
        }
        return token;
      },
      session({ session, token }) {
        if (session.user) {
          const id = token.googleSub ?? token.sub;
          session.user.id = typeof id === "string" ? id : "";
        }
        return session;
      },
    },
  };
});
