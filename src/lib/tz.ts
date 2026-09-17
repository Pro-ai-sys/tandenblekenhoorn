/**
 * Small helpers to work with "wall clock" time in Europe/Amsterdam, independent
 * of the server's own timezone (Vercel runs in UTC). Opening hours in
 * booking.ts are defined as Amsterdam local time, so we need to convert
 * between a local (dateStr, minutes-from-midnight) pair and a UTC instant.
 */

export const AMSTERDAM_TZ = "Europe/Amsterdam";

/** "YYYY-MM-DD" calendar date -> JS getDay()-style weekday (0=zondag..6=zaterdag). */
export function weekdayOf(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

function offsetMillisAt(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = dtf.formatToParts(instant).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== "literal") acc[p.type] = p.value;
    return acc;
  }, {});
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - instant.getTime();
}

/** Converts a local wall-clock time (in timeZone) to the corresponding UTC instant. */
export function zonedTimeToUtc(dateStr: string, minutesFromMidnight: number, timeZone = AMSTERDAM_TZ): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  const hour = Math.floor(minutesFromMidnight / 60);
  const minute = minutesFromMidnight % 60;
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const offset = offsetMillisAt(guess, timeZone);
  return new Date(guess.getTime() - offset);
}

/** Returns the current instant's calendar date + minutes-from-midnight in timeZone. */
export function nowInZone(timeZone = AMSTERDAM_TZ): { dateStr: string; minutesFromMidnight: number } {
  const now = new Date();
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = dtf.formatToParts(now).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== "literal") acc[p.type] = p.value;
    return acc;
  }, {});
  return {
    dateStr: `${parts.year}-${parts.month}-${parts.day}`,
    minutesFromMidnight: Number(parts.hour) * 60 + Number(parts.minute),
  };
}
