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

function Avatar({ src, alt }: { src?: string | null; alt: string }) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={36}
        height={36}
        className="size-9 rounded-full bg-card object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="inline-flex size-9 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent"
    >
      {alt.slice(0, 1).toUpperCase() || "?"}
    </span>
  );
}

const buttonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-card-border bg-card px-3 text-sm font-medium leading-5 text-foreground hover:border-accent/50";

function RedirectField() {
  const pathname = usePathname();
  return <input type="hidden" name="redirectTo" value={pathname || "/"} />;
}

function SignOutButton({ className = buttonClass }: { className?: string }) {
  return (
    <form action={signOutUser}>
      <RedirectField />
      <button type="submit" className={className}>
        Sign out
      </button>
    </form>
  );
}

function SignInButton({ compact, fullWidth }: { compact: boolean; fullWidth?: boolean }) {
  return (
    <form action={signInWithGoogle} className={fullWidth ? "w-full" : undefined}>
      <RedirectField />
      <button type="submit" className={`${buttonClass} ${fullWidth ? "w-full justify-start" : ""}`}>
        <GoogleMark className="size-4 shrink-0" />
        <span className="truncate">{compact ? "Sign in" : "Sign in with Google"}</span>
      </button>
    </form>
  );
}

export function AuthControls({
  variant,
}: {
  variant: "header" | "nav" | "menu" | "sheet";
}) {
  const enabled = useGoogleAuthEnabled();
  const { data, status } = useSession();
  const compact = variant === "header";

  if (status === "loading" || (enabled === null && !data?.user)) {
    return (
      <span className="inline-flex min-h-11 items-center px-2 text-xs text-muted">
        {compact ? "…" : "Checking sign-in…"}
      </span>
    );
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
            <span className="hidden max-w-[12rem] truncate text-xs text-muted xl:inline">{label}</span>
          ) : null}
          {variant === "nav" ? <SignOutButton /> : null}
        </div>
      );
    }
    return (
      <div
        className={
          variant === "menu"
            ? "mt-1 rounded-xl border border-card-border bg-card/80 px-3 py-3"
            : "rounded-2xl border border-card-border bg-background px-3 py-3"
        }
      >
        <div className="flex items-center gap-3">
          <Avatar src={data.user.image} alt={data.user.name || label} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{data.user.name || "Signed in"}</p>
            <p className="truncate text-xs text-muted">{label}</p>
          </div>
          <SignOutButton />
        </div>
        <p className="mt-2 text-xs leading-5 text-muted">
          Saved nights sync to this Google account when a store is configured.
        </p>
      </div>
    );
  }

  if (!enabled) {
    if (compact) return null;
    return (
      <p className="rounded-xl border border-dashed border-card-border px-3 py-3 text-xs leading-5 text-muted">
        Sign in with Google is not configured on this deploy. Add{" "}
        <code className="text-foreground">AUTH_SECRET</code>,{" "}
        <code className="text-foreground">AUTH_GOOGLE_ID</code>, and{" "}
        <code className="text-foreground">AUTH_GOOGLE_SECRET</code> on Vercel Production.
      </p>
    );
  }

  return <SignInButton compact={compact} fullWidth={variant === "menu"} />;
}
