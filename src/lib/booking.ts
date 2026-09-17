/**
 * Business rules from the projectplan (hoofdstuk 3):
 * - Vaste blokkeringstijd per behandeling = realistische duur + 15 min buffer.
 * - Openingstijden: donderdag hele dag, maandag t/m donderdag 's avonds.
 *   Overige tijden zijn alleen telefonisch/handmatig te plannen (niet online).
 */

export type TreatmentType = "single" | "double" | "triple";

export const TREATMENTS: Record<
  TreatmentType,
  {
    label: string;
    description: string;
    realMinutes: number;
    bufferMinutes: number;
    totalMinutes: number;
    price: number;
  }
> = {
  single: {
    label: "Single",
    description: "Tot 4 tinten witter · kleurbepaling voor- en achteraf",
    realMinutes: 45,
    bufferMinutes: 15,
    totalMinutes: 60,
    price: 69,
  },
  double: {
    label: "Double",
    description: "Tot 7 tinten witter · kleurbepaling voor- en achteraf",
    realMinutes: 60,
    bufferMinutes: 15,
    totalMinutes: 75,
    price: 109,
  },
  triple: {
    label: "Triple",
    description: "Tot 10 tinten witter · speciale intensieve voorbehandeling",
    realMinutes: 75,
    bufferMinutes: 15,
    totalMinutes: 90,
    price: 159,
  },
};

export function isTreatmentType(value: string): value is TreatmentType {
  return value === "single" || value === "double" || value === "triple";
}

/** 0 = zondag ... 6 = zaterdag (JS Date#getDay convention), times in local (Europe/Amsterdam) minutes-from-midnight. */
type Window = { startMinutes: number; endMinutes: number };

const DONDERDAG = 4;
const MAANDAG = 1;
const DINSDAG = 2;
const WOENSDAG = 3;

const OPENING_WINDOWS: Record<number, Window[]> = {
  [MAANDAG]: [{ startMinutes: 17 * 60, endMinutes: 21 * 60 + 30 }],
  [DINSDAG]: [{ startMinutes: 17 * 60, endMinutes: 21 * 60 + 30 }],
  [WOENSDAG]: [{ startMinutes: 17 * 60, endMinutes: 21 * 60 + 30 }],
  [DONDERDAG]: [{ startMinutes: 9 * 60 + 30, endMinutes: 21 * 60 }],
};

/** Start times are offered on a 15-minute grid. */
const SLOT_GRID_MINUTES = 15;

export function openingWindowsForDate(date: Date): Window[] {
  return OPENING_WINDOWS[date.getDay()] ?? [];
}

/**
 * Returns every possible slot start (as minutes-from-midnight, local time)
 * for the given date and treatment, ignoring existing bookings.
 */
export function possibleSlotStarts(date: Date, treatment: TreatmentType): number[] {
  const windows = openingWindowsForDate(date);
  const totalMinutes = TREATMENTS[treatment].totalMinutes;
  const starts: number[] = [];

  for (const window of windows) {
    for (
      let start = window.startMinutes;
      start + totalMinutes <= window.endMinutes;
      start += SLOT_GRID_MINUTES
    ) {
      starts.push(start);
    }
  }

  return starts;
}

export function minutesToTimeLabel(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Statuses that still occupy a slot (per hoofdstuk 4: geen automatische vervaltijd). */
export const ACTIVE_BOOKING_STATUSES = ["nieuw", "wacht_op_betaling", "bevestigd"] as const;
export type BookingStatus =
  | "nieuw"
  | "wacht_op_betaling"
  | "bevestigd"
  | "verlopen"
  | "geannuleerd";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  nieuw: "Nieuw",
  wacht_op_betaling: "Wacht op betaling",
  bevestigd: "Bevestigd",
  verlopen: "Verlopen",
  geannuleerd: "Geannuleerd",
};
