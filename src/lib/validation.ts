import { z } from "zod";

export const bookingRequestSchema = z.object({
  treatmentType: z.enum(["single", "double", "triple"]),
  startsAt: z.string().datetime(),
  name: z.string().trim().min(2, "Vul je volledige naam in.").max(120),
  email: z.string().trim().email("Vul een geldig e-mailadres in."),
  phone: z
    .string()
    .trim()
    .min(9, "Vul een geldig telefoonnummer in.")
    .max(20, "Vul een geldig telefoonnummer in."),
  marketingConsent: z.boolean().default(false),
});

export const manualBookingSchema = z.object({
  treatmentType: z.enum(["single", "double", "triple"]),
  startsAt: z.string().datetime(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().min(6).max(20).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(["nieuw", "wacht_op_betaling", "bevestigd", "verlopen", "geannuleerd"]),
});
