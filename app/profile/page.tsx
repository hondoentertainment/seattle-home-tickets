import type { Metadata } from "next";
import { ProfileClient } from "@/components/profile-client";

export const metadata: Metadata = {
  title: "Profile — Seattle Home Tickets",
  description:
    "Your Seattle Home Tickets profile: My teams, Saved, alert prefs, and optional Google sign-in.",
};

export default function ProfilePage() {
  return (
    <div className="page-gutter mx-auto w-full max-w-2xl flex-1 py-6">
      <ProfileClient />
    </div>
  );
}
