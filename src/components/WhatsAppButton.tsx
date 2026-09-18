import { site } from "@/lib/site";

export function WhatsAppButton() {
  const phoneDigits = site.phone.startsWith("0")
    ? `31${site.phone.slice(1)}`
    : site.phone;
  const message = encodeURIComponent(
    "Hoi! Ik heb een vraag over tanden bleken bij Golden Smile."
  );

  return (
    <a
      href={`https://wa.me/${phoneDigits}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:scale-105 hover:shadow-xl"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
        <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.63 4.53 1.73 6.42L4 29l7.79-1.7A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.98 17.13c-.29.82-1.44 1.5-2.36 1.7-.63.13-1.45.24-4.21-.9-3.53-1.46-5.8-5.03-5.98-5.27-.18-.24-1.43-1.9-1.43-3.62 0-1.72.9-2.56 1.22-2.91.32-.35.7-.44.93-.44.23 0 .47 0 .67.01.21.01.5-.08.78.6.29.7.98 2.42 1.07 2.6.09.18.15.39.03.63-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.37.38-.16.74.21.36.94 1.55 2.02 2.51 1.39 1.24 2.56 1.62 2.92 1.8.36.18.57.15.78-.09.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.81-.18.33.12 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.2 1.69Z" />
      </svg>
    </a>
  );
}
