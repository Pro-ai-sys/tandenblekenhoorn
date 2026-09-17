import { NextRequest, NextResponse } from "next/server";
import {
  ACTIVE_BOOKING_STATUSES,
  TREATMENTS,
  isTreatmentType,
  minutesToTimeLabel,
  possibleSlotStarts,
} from "@/lib/booking";
import { nowInZone, zonedTimeToUtc } from "@/lib/tz";
import { supabaseAdmin } from "@/lib/supabase/admin";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * GET /api/availability?type=single&date=2026-09-24
 * Returns the online-bookable start times for that day (hoofdstuk 3 & 4):
 * within the fixed opening windows for that weekday, minus any slot that
 * would overlap an existing active booking, minus times already in the past.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "";
  const date = searchParams.get("date") ?? "";

  if (!isTreatmentType(type)) {
    return NextResponse.json({ error: "Ongeldig behandeltype." }, { status: 400 });
  }
  if (!DATE_RE.test(date)) {
    return NextResponse.json({ error: "Ongeldige datum." }, { status: 400 });
  }

  const starts = possibleSlotStarts(new Date(`${date}T00:00:00Z`), type);
  if (starts.length === 0) {
    return NextResponse.json({ slots: [] });
  }
  const dayStart = zonedTimeToUtc(date, 0);
  const dayEnd = zonedTimeToUtc(date, 24 * 60);

  let existing: { starts_at: string; ends_at: string }[] | null;
  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("bookings")
      .select("starts_at, ends_at")
      .in("status", ACTIVE_BOOKING_STATUSES)
      .lt("starts_at", dayEnd.toISOString())
      .gt("ends_at", dayStart.toISOString());

    if (error) throw error;
    existing = data;
  } catch (err) {
    console.error("availability lookup failed", err);
    return NextResponse.json({ error: "Kon beschikbaarheid niet ophalen." }, { status: 500 });
  }

  const busyRanges = (existing ?? []).map((b) => ({
    start: new Date(b.starts_at).getTime(),
    end: new Date(b.ends_at).getTime(),
  }));

  const { dateStr: todayStr, minutesFromMidnight: nowMinutes } = nowInZone();
  const totalMinutes = TREATMENTS[type].totalMinutes;

  const slots = starts
    .filter((startMinutes) => {
      if (date === todayStr && startMinutes <= nowMinutes) return false;
      return true;
    })
    .map((startMinutes) => {
      const startsAt = zonedTimeToUtc(date, startMinutes);
      const endsAt = zonedTimeToUtc(date, startMinutes + totalMinutes);
      return { startMinutes, startsAt, endsAt };
    })
    .filter(({ startsAt, endsAt }) => {
      const startMs = startsAt.getTime();
      const endMs = endsAt.getTime();
      return !busyRanges.some((b) => startMs < b.end && endMs > b.start);
    })
    .map(({ startMinutes, startsAt }) => ({
      time: minutesToTimeLabel(startMinutes),
      startsAt: startsAt.toISOString(),
    }));

  return NextResponse.json({ slots });
}
