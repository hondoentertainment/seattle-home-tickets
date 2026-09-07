"use server";

import { signIn, signOut } from "@/auth";
import { isGoogleAuthConfigured } from "@/lib/auth-env";

function safeRedirectTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

export async function signInWithGoogle(formData: FormData) {
  if (!isGoogleAuthConfigured()) return;
  await signIn("google", { redirectTo: safeRedirectTo(formData.get("redirectTo")) });
}

export async function signOutUser(formData: FormData) {
  await signOut({ redirectTo: safeRedirectTo(formData.get("redirectTo")) });
}
