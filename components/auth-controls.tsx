"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signInWithGoogle, signOutUser } from "@/app/actions/auth";
import { useGoogleAuthEnabled } from "@/components/auth-session-provider";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.81.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.17.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58Z"
      />
    </svg>
  );
}

function Avatar({ src, alt, large }: { src?: string | null; alt: string; large?: boolean }) {
  const px = large ? 72 : 36;
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={px}
        height={px}
        className={`${large ? "size-[4.5rem]" : "size-9"} rounded-full bg-card object-cover`}
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`inline-flex ${large ? "size-[4.5rem] text-2xl" : "size-9 text-xs"} items-center justify-center rounded-full bg-accent/15 font-semibold text-accent`}
    >
      {alt.slice(0, 1).toUpperCase() || "?"}
    </span>
  );
}

const outlineButton =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-card-border bg-card px-3 text-sm font-medium leading-5 text-foreground hover:border-accent/50";

const primaryButton =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-3 text-sm font-semibold leading-5 text-background";

function RedirectField() {
  const pathname = usePathname();
  return <input type="hidden" name="redirectTo" value={pathname || "/"} />;
}

function SignOutButton({ className = outlineButton }: { className?: string }) {
  return (
    <form action={signOutUser}>
      <RedirectField />
      <button type="submit" className={className}>
        Sign out
      </button>
    </form>
  );
}

function SignInButton({ compact, prominent }: { compact: boolean; prominent: boolean }) {
  return (
    <form action={signInWithGoogle} className={prominent ? "w-full" : undefined}>
      <RedirectField />
      <button type="submit" className={prominent ? primaryButton : outlineButton}>
        <GoogleMark className="size-4 shrink-0" />
        <span className="truncate">{compact ? "Sign in" : "Continue with Google"}</span>
      </button>
    </form>
  );
}

export function AuthControls({
  variant,
}: {
  variant: "header" | "nav" | "menu" | "sheet" | "profile";
}) {
  const enabled = useGoogleAuthEnabled();
  const { data, status } = useSession();
  const compact = variant === "header";

  if (status === "loading" || (enabled === null && !data?.user)) {
    if (variant === "profile") {
      return (
        <div className="flex flex-col items-center gap-2">
          <span
            aria-hidden
            className="inline-flex size-16 items-center justify-center rounded-full bg-card text-sm font-semibold text-muted"
          >
            ·
          </span>
          <p className="text-xl font-semibold text-muted">Checking sign-in…</p>
          <p className="text-sm text-muted">Local prefs still work.</p>
        </div>
      );
    }
    return null;
  }

  if (data?.user) {
    const label = data.user.email || data.user.name || "Signed in";
    if (compact || variant === "nav") {
      return (
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex min-h-11 items-center" title={label}>
            <Avatar src={data.user.image} alt={data.user.name || label} />
            <span className="sr-only">{label}</span>
          </span>
          {variant === "nav" ? (
            <span className="hidden max-w-[12rem] truncate text-xs text-muted xl:inline">
              {data.user.name || "Signed in"}
            </span>
          ) : null}
          {variant === "nav" ? <SignOutButton /> : null}
        </div>
      );
    }
    if (variant === "profile") {
      return (
        <div className="flex flex-col items-center gap-3">
          <Avatar src={data.user.image} alt={data.user.name || label} large />
          <div className="min-w-0">
            <p className="truncate text-2xl font-bold text-foreground">{data.user.name || "Signed in"}</p>
            {data.user.email ? <p className="truncate text-sm text-muted">{data.user.email}</p> : null}
          </div>
          <SignOutButton />
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <Avatar src={data.user.image} alt={data.user.name || label} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">{data.user.name || "Signed in"}</p>
          <p className="truncate text-xs text-muted">Saved games sync here</p>
        </div>
        <SignOutButton />
      </div>
    );
  }

  if (!enabled) {
    if (variant === "profile") {
      return (
        <div className="flex flex-col items-center gap-2">
          <Avatar alt="Guest" large />
          <p className="text-2xl font-bold text-foreground">Guest</p>
          <p className="text-sm text-muted">Sign in for a better experience</p>
          <p className="max-w-sm text-xs leading-5 text-muted">
            Google sign-in is not configured on this deploy. Prefs stay on this device.
          </p>
        </div>
      );
    }
    return null;
  }

  if (variant === "profile") {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar alt="Guest" large />
          <p className="text-2xl font-bold text-foreground">Guest</p>
          <p className="text-sm text-muted">Sign in for a better experience</p>
        </div>
        <SignInButton compact={false} prominent />
      </div>
    );
  }

  return <SignInButton compact={compact} prominent={variant === "menu" || variant === "sheet"} />;
}
