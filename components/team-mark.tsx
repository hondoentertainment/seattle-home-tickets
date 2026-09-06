import { sportTileLabel, type TeamMark as TeamMarkData } from "@/lib/teams";

export function TeamMark({
  mark,
  size = "lg",
}: {
  mark: TeamMarkData;
  size?: "sm" | "lg";
}) {
  const box = size === "lg" ? "h-[4.5rem] w-[4.5rem] px-1.5" : "h-11 w-11 px-1";
  const initials = size === "lg" ? "text-lg" : "text-[11px]";
  const sport = size === "lg" ? "text-[8px] leading-tight" : "text-[7px] leading-tight";

  return (
    <span
      className={`grid shrink-0 place-items-center rounded-2xl text-center font-black tracking-tight shadow-inner ${box}`}
      style={{
        background: mark.bg,
        color: mark.fg,
        boxShadow: `inset 0 0 0 2px ${mark.ring}55`,
      }}
      aria-hidden
    >
      <span className={`leading-none ${initials}`}>{mark.initials}</span>
      {mark.sport ? (
        <span className={`mt-0.5 font-bold uppercase tracking-wide ${sport}`}>
          {sportTileLabel(mark.sport)}
        </span>
      ) : null}
    </span>
  );
}
