"use client";

import { useState } from "react";
import { CustomerEditForm } from "@/components/admin/CustomerEditForm";
import { BookingShadeHistory } from "@/components/admin/BookingShadeHistory";
import { PhotoGallery } from "@/components/admin/PhotoGallery";
import { QuickAddTreatment } from "@/components/admin/QuickAddTreatment";

type Booking = {
  id: string;
  treatment_type: string;
  starts_at: string;
  status: string;
  tooth_shade: string | null;
};

type Photo = { id: string; url: string; created_at: string };

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
};

const TABS = [
  { key: "overzicht", label: "Overzicht" },
  { key: "boekingen", label: "Boekingen & tandkleur" },
  { key: "fotos", label: "Foto's" },
  { key: "opmerkingen", label: "Opmerkingen" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function CustomerDetailTabs({
  customer,
  bookings,
  photos,
}: {
  customer: Customer;
  bookings: Booking[];
  photos: Photo[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("overzicht");

  const lastBooking = bookings[0];
  const lastTreatmentLabel = lastBooking
    ? new Intl.DateTimeFormat("nl-NL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(lastBooking.starts_at))
    : "nog geen behandeling";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink-900">{customer.name}</h1>
          <p className="mt-1 text-sm text-ink-500">
            {customer.email} · {customer.phone}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-gold-100 px-3 py-1 text-xs font-semibold text-gold-700">
              Laatste behandeling: {lastTreatmentLabel}
            </span>
            <span className="rounded-full border border-gold-200 px-3 py-1 text-xs text-ink-700">
              {bookings.length}{" "}
              {bookings.length === 1 ? "behandeling" : "behandelingen"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-6 border-b border-gold-200/60">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`-mb-px border-b-2 pb-3 text-sm font-semibold transition ${
              activeTab === tab.key
                ? "border-gold-600 text-ink-900"
                : "border-transparent text-ink-500 hover:text-ink-700"
            }`}
          >
            {tab.label}
            {tab.key === "boekingen" && (
              <span className="ml-1 font-normal text-ink-500">
                ({bookings.length})
              </span>
            )}
            {tab.key === "fotos" && (
              <span className="ml-1 font-normal text-ink-500">
                ({photos.length})
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "overzicht" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gold-200/60 bg-white p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
              Contactgegevens
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-gold-100 pb-2">
                <span className="text-ink-500">Naam</span>
                <span className="font-medium text-ink-900">
                  {customer.name}
                </span>
              </div>
              <div className="flex justify-between border-b border-gold-100 pb-2">
                <span className="text-ink-500">E-mail</span>
                <span className="font-medium text-ink-900">
                  {customer.email}
                </span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-ink-500">Telefoon</span>
                <span className="font-medium text-ink-900">
                  {customer.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gold-200/60 bg-white p-5">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
              Laatste behandeling
            </h3>
            {lastBooking ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-gold-100 pb-2">
                  <span className="text-ink-500">Datum</span>
                  <span className="font-medium text-ink-900">
                    {lastTreatmentLabel}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gold-100 pb-2">
                  <span className="text-ink-500">Behandeling</span>
                  <span className="font-medium capitalize text-ink-900">
                    {lastBooking.treatment_type}
                  </span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-ink-500">Tandkleur</span>
                  <span className="font-medium text-ink-900">
                    {lastBooking.tooth_shade || "—"}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-ink-500">Nog geen behandelingen.</p>
            )}
          </div>

          {customer.notes && (
            <div className="rounded-2xl border border-gold-200/60 bg-white p-5 sm:col-span-2">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-500">
                Opmerkingen
              </h3>
              <p className="text-sm text-ink-700">{customer.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "boekingen" && (
        <div className="space-y-4">
          <QuickAddTreatment customerId={customer.id} />
          <BookingShadeHistory bookings={bookings} />
        </div>
      )}

      {activeTab === "fotos" && (
        <PhotoGallery customerId={customer.id} initialPhotos={photos} />
      )}

      {activeTab === "opmerkingen" && <CustomerEditForm customer={customer} />}
    </div>
  );
}
