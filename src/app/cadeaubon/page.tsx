import type { Metadata } from "next";
import { GiftVoucherForm } from "@/components/GiftVoucherForm";

export const metadata: Metadata = {
  title: "Cadeaubon",
  description:
    "Geef een Golden Smile cadeaubon cadeau voor een stralende, witte glimlach.",
};

export default function CadeaubonPage() {
  return (
    <div className="container-page max-w-2xl py-16">
      <h1 className="font-serif text-4xl text-ink-900">Cadeaubon</h1>
      <p className="mt-4 text-ink-700">
        Geef iemand een stralende, witte glimlach cadeau. Vul onderstaand
        formulier in, en Paula neemt contact met je op om de betaling en
        levering van de cadeaubon te regelen.
      </p>
      <div className="mt-10">
        <GiftVoucherForm />
      </div>
    </div>
  );
}
