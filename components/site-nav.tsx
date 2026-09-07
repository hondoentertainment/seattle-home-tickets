"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/teams", label: "Teams" },
  { href: "/standings", label: "Standings" },
] as const;

const MORE = [
  { href: "/profile", label: "Profile" },
  { href: "/holidays", label: "Holidays" },
  { href: "/stats", label: "Stats" },
  { href: "/promotions", label: "Promotions" },
  { href: "/venues", label: "Venues" },
  { href: "/alerts", label: "Alerts" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "FAQ" },
] as const;

const DESKTOP_LINKS = [...PRIMARY, ...MORE.filter((link) => link.href !== "/profile")] as const;

function isActive(pathname: string, href: string) {
  return pathname === href;
}

export function SiteNav() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuTitleId = useId();
  const menuOpen = menuPath === pathname;
  const moreActive = MORE.some((link) => link.href !== "/profile" && isActive(pathname, link.href));

  function closeMenu() {
    setMenuPath(null);
  }

  useEffect(() => {
    if (!menuOpen) return;

    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const menuButton = menuButtonRef.current;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      menuButton?.focus();
    };
  }, [menuOpen]);

  const menu = menuOpen ? (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div
        id="site-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={menuTitleId}
        style={{ backgroundColor: "#06110e" }}
        className="absolute inset-0 z-10 flex h-dvh max-h-dvh w-full flex-col bg-[#06110e] pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
      >
        <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-card-border bg-[#06110e] px-4">
          <p id={menuTitleId} className="text-sm font-semibold text-foreground">
            More
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMenu}
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-card-border bg-card px-3.5 text-sm leading-5 text-muted hover:text-foreground"
          >
            Close
          </button>
        </div>
        <nav aria-label="More pages" className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain bg-[#06110e] p-2">
          {MORE.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={closeMenu}
                className={`inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-medium ${
                  active ? "bg-accent/15 text-accent" : "text-foreground hover:bg-card"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <header className="sticky top-0 z-20 border-b border-card-border/80 bg-background/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur">
      <div className="page-gutter mx-auto flex max-w-7xl flex-col gap-2 py-2">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <Link href="/" className="min-w-0 truncate text-base font-bold tracking-tight text-foreground lg:text-sm lg:font-semibold">
            Seattle Home Tickets
          </Link>
          <nav aria-label="Primary" className="hidden flex-wrap items-center justify-end gap-0.5 lg:flex">
            {DESKTOP_LINKS.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${
                    active ? "bg-accent text-background" : "text-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/profile"
              aria-current={isActive(pathname, "/profile") ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm ${
                isActive(pathname, "/profile") ? "bg-accent text-background" : "text-muted hover:text-foreground"
              }`}
            >
              Profile
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <Link
              href="/profile"
              aria-current={isActive(pathname, "/profile") ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-xl border px-3 text-sm font-semibold leading-5 ${
                isActive(pathname, "/profile")
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-card-border bg-card text-foreground"
              }`}
            >
              Profile
            </Link>
          </div>
        </div>

        <nav aria-label="Primary" className="grid w-full grid-cols-4 gap-2 lg:hidden">
          {PRIMARY.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 min-w-0 items-center justify-center rounded-full px-1 text-center text-xs font-semibold leading-5 ${
                  active ? "bg-accent text-background" : "bg-card text-muted"
                }`}
              >
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
          <button
            ref={menuButtonRef}
            type="button"
            className={`inline-flex min-h-11 min-w-0 items-center justify-center rounded-full px-1 text-center text-xs font-semibold leading-5 ${
              menuOpen || moreActive ? "bg-accent text-background" : "bg-card text-muted"
            }`}
            aria-label="More pages"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            onClick={() => setMenuPath((open) => (open === pathname ? null : pathname))}
          >
            <span className="truncate">More</span>
          </button>
        </nav>
      </div>

      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </header>
  );
}
