import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { authSecret, googleClientId, googleClientSecret, isGoogleAuthConfigured } from "@/lib/auth-env";

const googleId = googleClientId();
const googleSecret = googleClientSecret();

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: authSecret(),
  session: { strategy: "jwt" },
  providers: isGoogleAuthConfigured() && googleId && googleSecret
    ? [
        Google({
          clientId: googleId,
          clientSecret: googleSecret,
        }),
      ]
    : [],
  callbacks: {
    jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        const sub = typeof profile?.sub === "string" ? profile.sub : token.sub;
        if (sub) token.googleSub = sub;
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
});
