"use client";

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  size = "default",
}: {
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
  ariaLabel: string;
  size?: "default" | "compact";
}) {
  const cols =
    options.length === 4 ? "grid-cols-4" : options.length === 2 ? "grid-cols-2" : "grid-cols-3";
  const height = size === "compact" ? "min-h-10 text-xs" : "min-h-11 text-sm";
  const pad = options.length >= 4 ? "px-1.5" : "px-3";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`grid w-full ${cols} rounded-full border border-card-border bg-background p-1`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={`inline-flex ${height} items-center justify-center rounded-full ${pad} font-semibold transition ${
              selected ? "bg-accent text-background" : "text-muted hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
