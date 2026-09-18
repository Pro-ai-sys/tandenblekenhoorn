import { Resend } from "resend";
import { TREATMENTS, type TreatmentType } from "@/lib/booking";
import { site } from "@/lib/site";

function resendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

type BookingSummary = {
  treatmentType: TreatmentType;
  startsAt: string;
  name: string;
  email: string;
  phone: string;
};

/**
 * Sends the customer confirmation + internal "nieuwe aanvraag" notification
 * to one or more beheerders (hoofdstuk 4, stap 5). Silently no-ops when
 * RESEND_API_KEY isn't configured yet, so local development doesn't require it.
 */
export async function sendBookingEmails(booking: BookingSummary) {
  const resend = resendClient();
  if (!resend) {
    console.warn(
      "RESEND_API_KEY ontbreekt — bevestigingsmails zijn overgeslagen."
    );
    return;
  }

  const from =
    process.env.EMAIL_FROM ?? `${site.name} <boekingen@${site.domain}>`;

  // Ondersteunt één of meerdere beheerder-adressen, gescheiden door een komma
  // in EMAIL_ADMIN_TO (bijv. "paula@tandenblekenhoorn.nl,collega@tandenblekenhoorn.nl").
  const adminTo = (process.env.EMAIL_ADMIN_TO ?? site.email)
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);

  const treatment = TREATMENTS[booking.treatmentType];
  const when = formatDateTime(booking.startsAt);

  await resend.emails.send({
    from,
    to: booking.email,
    subject: `Je boekingsaanvraag bij ${site.name} — ${when}`,
    text: [
      `Beste ${booking.name},`,
      "",
      `We hebben je boekingsaanvraag ontvangen voor: ${treatment.label} (${treatment.description}).`,
      `Prijs: €${treatment.price},-`,
      `Datum en tijd: ${when}.`,
      "",
      `Paula neemt via WhatsApp contact met je op om de aanbetaling van €20,- via Tikkie af te ronden.`,
      `Zodra de Tikkie betaald is, is je afspraak definitief bevestigd.`,
      "",
      `Geef je kenteken pas vlak vóór je afspraak door via WhatsApp (niet nu al) — dan zetten we deze op tijd vast in de parkeer-app zodat je gratis kunt parkeren tijdens je behandeling.`,
      "",
      `Tot snel bij ${site.name}!`,
      site.owner,
    ].join("\n"),
  });

  await resend.emails.send({
    from,
    to: adminTo,
    subject: `Nieuwe boekingsaanvraag: ${treatment.label} — ${when}`,
    text: [
      `Nieuwe online boekingsaanvraag:`,
      "",
      `Behandeling: ${treatment.label} (${treatment.description}) — €${treatment.price},-`,
      `Datum en tijd: ${when}`,
      `Naam: ${booking.name}`,
      `E-mail: ${booking.email}`,
      `Telefoon: ${booking.phone}`,
      "",
      `Stuur de Tikkie van €20,- via WhatsApp en bevestig de boeking in de admin-omgeving zodra deze betaald is.`,
    ].join("\n"),
  });
}
