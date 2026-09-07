import type { Metadata } from "next";
import { ProfileClient } from "@/components/profile-client";

export const metadata: Metadata = {
  title: "Profile — Seattle Home Tickets",
  description:
    "Your Seattle Home Tickets profile: My teams, Saved, alert prefs, and optional Google sign-in.",
};

export default function ProfilePage() {
  return (
    <div className="page-gutter mx-auto w-full max-w-2xl flex-1 py-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Profile
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        One place for who you are and how Home should look. Works signed out. Google is
        optional and only appears when this deploy has OAuth secrets.
      </p>
      <div className="mt-6">
        <ProfileClient />
      </div>
    </div>
  );
}
