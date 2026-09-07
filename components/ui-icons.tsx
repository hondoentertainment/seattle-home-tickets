export function IconRefresh({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M17.65 6.35A7.96 7.96 0 0 0 12 4C7.58 4 4.01 7.58 4.01 12S7.58 20 12 20c3.73 0 6.84-2.55 7.73-6h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4z"
      />
    </svg>
  );
}

export function IconPerson({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 12a4.2 4.2 0 1 0-4.2-4.2A4.2 4.2 0 0 0 12 12Zm0 2.1c-3.6 0-8.1 1.8-8.1 5.4v1.2h16.2v-1.2c0-3.6-4.5-5.4-8.1-5.4Z"
      />
    </svg>
  );
}

export function IconHome({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 3.4 3.5 10.2V21h6.2v-6.3h4.6V21h6.2V10.2L12 3.4Z"
      />
    </svg>
  );
}

export function IconJersey({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M8.2 3.5 12 5.2l3.8-1.7L19 6.2l-2.1 2.3V20H7.1V8.5L5 6.2 8.2 3.5Z"
      />
    </svg>
  );
}

export function IconTrophy({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M7 4h10v2.2h2.4V9c0 2-1.5 3.6-3.4 4.1A4.6 4.6 0 0 1 13.2 16H13v1.4h3V20H8v-2.6h3V16h-.2a4.6 4.6 0 0 1-2.8-2.9A4.2 4.2 0 0 1 4.6 9V6.2H7V4Z"
      />
    </svg>
  );
}

export function IconMenu({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M4 7h16v2.2H4V7Zm0 4.4h16v2.2H4v-2.2Zm0 4.4h16V18H4v-2.2Z"
      />
    </svg>
  );
}

export function IconClose({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M6.4 5.2 12 10.8l5.6-5.6 1.2 1.2L13.2 12l5.6 5.6-1.2 1.2L12 13.2l-5.6 5.6-1.2-1.2L10.8 12 5.2 6.4 6.4 5.2Z"
      />
    </svg>
  );
}

export function IconChevron({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M9.2 5.2 16 12l-6.8 6.8-1.3-1.3L13.4 12 7.9 6.5 9.2 5.2Z" />
    </svg>
  );
}

export function IconBack({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M14.8 5.2 8 12l6.8 6.8 1.3-1.3L10.6 12l5.5-5.5-1.3-1.3Z" />
    </svg>
  );
}

export function IconSearch({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M10.4 3.8a6.6 6.6 0 1 1 0 13.2 6.6 6.6 0 0 1 0-13.2Zm0 2a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm8.1 11.2 3.3 3.3-1.4 1.4-3.3-3.3 1.4-1.4Z"
      />
    </svg>
  );
}

export function IconSliders({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M4 6.2h9.2V4H20v2.2h-6.8V8H4V6.2Zm0 5.8h4.4V10H20v2.2h-11.6V14H4v-2Zm0 5.8h11.2V16H20v2.2h-4.8V20H4v-2.2Z"
      />
    </svg>
  );
}

export function IconHeart({ filled, className = "size-5" }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        d="M12 20s-7.2-4.4-9-8.3C1.4 8.4 3.2 5 6.6 5A4.4 4.4 0 0 1 12 7.6 4.4 4.4 0 0 1 17.4 5c3.4 0 5.2 3.4 3.6 6.7C19.2 15.6 12 20 12 20Z"
      />
    </svg>
  );
}

export function IconCalendar({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M8 3.5h2V5h4V3.5h2V5h3.5V20h-15V5H8V3.5ZM6.5 9v9h11V9h-11Z"
      />
    </svg>
  );
}

export function IconChart({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M5 19V9h3.2v10H5Zm5.4 0V5h3.2v14h-3.2Zm5.4 0v-7H19v7h-3.2Z" />
    </svg>
  );
}

export function IconTag({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M3.8 13.1 10.9 20l9.3-9.3V4.8h-5.9L3.8 13.1Zm13.3-6.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"
      />
    </svg>
  );
}

export function IconStadium({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M4 17.5 6.2 8l5.8-3 5.8 3 2.2 9.5h-3.2l-.8-3.4H8l-.8 3.4H4Zm5.2-5.4h5.6l-.6-2.6L12 8.4l-2.2 1.1-.6 2.6Z"
      />
    </svg>
  );
}

export function IconBell({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 3.5A5.2 5.2 0 0 1 17.2 8.7v4.2l1.6 2.3H5.2l1.6-2.3V8.7A5.2 5.2 0 0 1 12 3.5Zm-2.2 14.3h4.4a2.2 2.2 0 0 1-4.4 0Z"
      />
    </svg>
  );
}

export function IconMail({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M3.6 6.2h16.8v12H3.6v-12Zm8.4 6.3L5.8 8.4v1.7l6.2 3.8 6.2-3.8V8.4L12 12.5Z"
      />
    </svg>
  );
}

export function IconHelp({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 3.5A8.5 8.5 0 1 1 3.5 12 8.5 8.5 0 0 1 12 3.5Zm0 12.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm0-8.4a3 3 0 0 0-3 2.8h1.9a1.2 1.2 0 0 1 2.3.5c0 .6-.4.9-1.2 1.4-.9.6-1.8 1.3-1.8 2.6v.3h1.9v-.3c0-.6.4-1 1.3-1.6 1.1-.7 2-1.6 2-3 0-1.8-1.5-3.1-3.4-3.1Z"
      />
    </svg>
  );
}

export function IconBookmark({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M7 3.8h10A1.6 1.6 0 0 1 18.6 5.4V20L12 16.4 5.4 20V5.4A1.6 1.6 0 0 1 7 3.8Z" />
    </svg>
  );
}

export function IconPin({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 3.6a6.2 6.2 0 0 1 6.2 6.2c0 4.4-6.2 10.6-6.2 10.6S5.8 14.2 5.8 9.8A6.2 6.2 0 0 1 12 3.6Zm0 4.2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
      />
    </svg>
  );
}

export function IconCloudSun({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M15.2 6.2a3.4 3.4 0 0 1 1.4 6.5 4.6 4.6 0 0 1-8.6 1.6H6.8a3.3 3.3 0 0 1 0-6.6 4.5 4.5 0 0 1 8.4-1.5Z"
      />
    </svg>
  );
}

export function IconCar({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M6.4 7.4 5 11H3.4v6.4h2.2V19H8v-1.6h8V19h2.4v-1.6h2.2V11H19l-1.4-3.6H6.4ZM7.6 9h8.8l.8 2H6.8l.8-2ZM6.6 14.2a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Zm10.8 0a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
      />
    </svg>
  );
}

export function IconMap({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="m3.6 6.2 5.2-2 6.4 2 5.2-2v13.6l-5.2 2-6.4-2-5.2 2V6.2Zm2 1.8v9.2l3.2-1.2V6.8L5.6 8Zm10.8 9.2 2-0.8V7.2l-2 .8v9.2Z"
      />
    </svg>
  );
}

export function IconStore({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M4 5.5h16l1.2 5.2H2.8L4 5.5Zm-.4 7.2h3.2V19H6v-4.2h3.2V19h8.4v-6.3h2.4v8.3H3.6v-8.3Z"
      />
    </svg>
  );
}

export function IconCheck({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M9.2 16.4 4.8 12l1.4-1.4 3 3 8.6-8.6 1.4 1.4-10 10.6Z"
      />
    </svg>
  );
}

export function IconPlus({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
    </svg>
  );
}

export function IconShield({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path fill="currentColor" d="M12 3.2 20 6.2v6.3c0 4.4-3.3 7.6-8 8.7-4.7-1.1-8-4.3-8-8.7V6.2L12 3.2Z" />
    </svg>
  );
}
