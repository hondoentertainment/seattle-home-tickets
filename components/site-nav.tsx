"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { HeaderRefreshButton } from "@/components/header-refresh-button";
import { PRODUCT_NAME } from "@/lib/brand";
import {
  IconBell,
  IconCalendar,
  IconChart,
  IconChevron,
  IconClose,
  IconHelp,
  IconHome,
  IconJersey,
  IconMail,
  IconMenu,
  IconPerson,
  IconStadium,
  IconTag,
  IconTrophy,
  IconBack,
} from "@/components/ui-icons";

const PRIMARY = [
  { href: "/", label: "Home", icon: IconHome },
  { href: "/teams", label: "Teams", icon: IconJersey },
  { href: "/standings", label: "Standings", icon: IconTrophy },
] as const;

const MORE = [
  { href: "/holidays", label: "Holidays", icon: IconCalendar },
  { href: "/stats", label: "Stats", icon: IconChart },
  { href: "/promotions", label: "Promotions", icon: IconTag },
  { href: "/venues", label: "Venues", icon: IconStadium },
  { href: "/alerts", label: "Alerts", icon: IconBell },
  { href: "/contact", label: "Contact", icon: IconMail },
  { href: "/about", label: "FAQ", icon: IconHelp },
] as const;

const DESKTOP_LINKS = [...PRIMARY, ...MORE] as const;

function isActive(pathname: string, href: string) {
  return pathname === href;
}

function circleButtonClass(active?: boolean) {
  return `inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border ${
    active
      ? "border-accent bg-accent/10 text-accent"
      : "border-card-border bg-card text-foreground hover:border-accent/50"
  }`;
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
  const onProfile = pathname === "/profile";

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
        <div className="relative flex min-h-14 shrink-0 items-center justify-center px-4">
          <p id={menuTitleId} className="text-base font-semibold text-foreground">
            More
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeMenu}
            aria-label="Close"
            className="absolute right-3 inline-flex min-h-11 min-w-11 items-center justify-center text-gold hover:text-foreground"
          >
            <IconClose />
          </button>
        </div>
        <nav aria-label="More pages" className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-2">
          {MORE.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={closeMenu}
                className={`flex min-h-14 items-center gap-3 border-b border-card-border/70 px-3 text-base font-medium ${
                  active ? "bg-gold/10 text-foreground" : "text-foreground"
                }`}
              >
                <span className={active ? "text-gold" : "text-foreground"}>
                  <Icon />
                </span>
                <span className="flex-1">{link.label}</span>
                <span className={active ? "text-gold" : "text-muted"}>
                  <IconChevron />
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-card-border/80 bg-background/90 pt-[env(safe-area-inset-top,0px)] backdrop-blur">
        <div className="page-gutter mx-auto flex max-w-7xl items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 items-center gap-1">
            {onProfile ? (
              <Link href="/" aria-label="Back to Home" className={circleButtonClass()}>
                <IconBack />
              </Link>
            ) : null}
            <Link
              href={onProfile ? "/profile" : "/"}
              className={`min-w-0 truncate font-bold tracking-tight text-foreground ${
                onProfile ? "pl-1 text-base lg:text-sm" : "text-base lg:text-sm lg:font-semibold"
              }`}
            >
              {onProfile ? "Profile" : PRODUCT_NAME}
            </Link>
          </div>
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
            <HeaderRefreshButton />
            <Link
              href="/profile"
              aria-label="Profile"
              aria-current={onProfile ? "page" : undefined}
              className={circleButtonClass(onProfile)}
            >
              <IconPerson />
            </Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2 lg:hidden">
            <HeaderRefreshButton />
            {onProfile ? null : (
              <Link
                href="/profile"
                aria-label="Profile"
                aria-current={onProfile ? "page" : undefined}
                className={circleButtonClass(onProfile)}
              >
                <IconPerson />
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-card-border/80 bg-background/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur lg:hidden"
      >
        <div className="grid h-16 grid-cols-4">
          {PRIMARY.map((link) => {
            const active = isActive(pathname, link.href);
            const Icon = link.icon;
            return (
              <TabLink key={link.href} href={link.href} label={link.label} active={active}>
                <Icon className="size-5" />
              </TabLink>
            );
          })}
          <button
            ref={menuButtonRef}
            type="button"
            className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
              menuOpen || moreActive ? "text-gold" : "text-muted"
            }`}
            aria-label="More pages"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            onClick={() => setMenuPath((open) => (open === pathname ? null : pathname))}
          >
            {menuOpen || moreActive ? (
              <span className="absolute top-1 h-0.5 w-6 rounded-full bg-gold" />
            ) : null}
            <IconMenu className="size-5" />
            More
          </button>
        </div>
      </nav>

      {typeof document !== "undefined" && menu ? createPortal(menu, document.body) : null}
    </>
  );
}

function TabLink({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold ${
        active ? "text-gold" : "text-muted"
      }`}
    >
      {active ? <span className="absolute top-1 h-0.5 w-6 rounded-full bg-gold" /> : null}
      {children}
      {label}
    </Link>
  );
}
