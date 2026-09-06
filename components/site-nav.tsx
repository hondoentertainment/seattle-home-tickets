"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { formatLastCheckedShort, refreshStamp } from "@/lib/refresh";

const PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/holidays", label: "Holidays" },
  { href: "/teams", label: "Teams" },
  { href: "/standings", label: "Standings" },
] as const;

const MORE = [
  { href: "/stats", label: "Ticket Stats" },
  { href: "/promotions", label: "Promotions" },
  { href: "/venues", label: "Venues" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "FAQ" },
] as const;

const ALL_LINKS = [...PRIMARY, ...MORE] as const;

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
  const moreActive = MORE.some((link) => isActive(pathname, link.href));

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

  return (
    <header className="sticky top-0 z-20 border-b border-card-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex min-h-11 items-center justify-between gap-3">
          <Link href="/" className="text-[17px] font-bold tracking-tight text-foreground lg:text-sm lg:font-semibold">
            Seattle Home Tickets
          </Link>
          <nav aria-label="Primary" className="hidden flex-wrap items-center justify-end gap-0.5 lg:flex">
            {ALL_LINKS.map((link) => {
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
          </nav>
          <button
            ref={menuButtonRef}
            type="button"
            className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border px-3 text-[13px] font-semibold lg:hidden ${
              menuOpen || moreActive
                ? "border-accent bg-accent/10 text-accent"
                : "border-card-border bg-card text-accent"
            }`}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            onClick={() => setMenuPath((open) => (open === pathname ? null : pathname))}
          >
            Menu
          </button>
        </div>

        <nav aria-label="Primary" className="flex gap-2 overflow-x-auto lg:hidden">
          {PRIMARY.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-[13px] font-semibold ${
                  active ? "bg-accent text-background" : "bg-card text-muted"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <p className="text-[11px] leading-4 text-muted">
          Catalog last checked {formatLastCheckedShort(refreshStamp.lastChecked)} · estimates not live
        </p>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={closeMenu}
          />
          <div
            id="site-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={menuTitleId}
            className="absolute inset-y-0 right-0 flex w-[min(20rem,88vw)] flex-col border-l border-card-border bg-background shadow-2xl"
          >
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-card-border px-4">
              <p id={menuTitleId} className="text-sm font-semibold text-foreground">
                More
              </p>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-[10px] border border-card-border px-3 text-sm text-muted hover:text-foreground"
              >
                Close
              </button>
            </div>
            <nav aria-label="More pages" className="flex flex-col p-2">
              {MORE.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
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
      ) : null}
    </header>
  );
}
