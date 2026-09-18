"use client";

import { useRef, useState } from "react";

type Photo = { id: string; url: string; created_at: string };

export function PhotoGallery({
  customerId,
  initialPhotos,
}: {
  customerId: string;
  initialPhotos: Photo[];
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploading, setUploading] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/admin/customers/${customerId}/photos`, {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setPhotos((prev) => [data.photo, ...prev]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(photoId: string) {
    if (!confirm("Deze foto verwijderen?")) return;
    const res = await fetch(
      `/api/admin/customers/${customerId}/photos/${photoId}`,
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-full bg-gold-600 px-5 py-2 text-sm font-semibold text-white hover:bg-gold-700 disabled:opacity-60"
        >
          {uploading ? "Uploaden…" : "+ Foto toevoegen"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {photos.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative">
              <button
                type="button"
                onClick={() => setLightboxUrl(photo.url)}
                className="block h-20 w-20 overflow-hidden rounded-lg border border-gold-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt="Gebitsfoto"
                  className="h-full w-full object-cover"
                />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(photo.id)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white opacity-0 shadow group-hover:opacity-100"
                aria-label="Verwijderen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-ink-500">
          Nog geen foto&apos;s geüpload.
        </p>
      )}

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setLightboxUrl(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Gebitsfoto groot"
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </div>
  );
}
