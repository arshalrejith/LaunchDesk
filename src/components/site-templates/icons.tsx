import type { LucideIcon } from "lucide-react";
import { BadgeDollarSign, Clock3, MapPin, MessageCircle, ShoppingBag, Tag } from "lucide-react";

// Shared across all three templates so the WhatsApp glyph never drifts.
export function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" width={size} height={size} aria-hidden="true">
      <path d="M16.04 3C9.4 3 4 8.36 4 15c0 2.23.61 4.31 1.67 6.1L4 29l8.1-2.6A11.9 11.9 0 0 0 16.04 27C22.68 27 28 21.64 28 15S22.68 3 16.04 3Zm0 21.7c-1.9 0-3.68-.53-5.2-1.44l-.37-.22-4.8 1.54 1.57-4.67-.24-.38A9.6 9.6 0 0 1 5.6 15c0-5.75 4.7-10.4 10.44-10.4S26.4 9.25 26.4 15 21.78 24.7 16.04 24.7Zm5.7-7.8c-.31-.16-1.83-.9-2.11-1-.28-.1-.49-.16-.7.16-.2.31-.8 1-.98 1.2-.18.21-.36.23-.67.08-.31-.16-1.3-.48-2.48-1.53-.92-.82-1.54-1.83-1.72-2.14-.18-.31-.02-.48.14-.63.14-.14.31-.36.47-.55.16-.18.2-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.7-1.69-.96-2.31-.25-.6-.51-.52-.7-.53h-.6c-.2 0-.55.08-.83.39-.28.31-1.09 1.07-1.09 2.6s1.12 3.02 1.28 3.23c.16.21 2.2 3.36 5.34 4.71.75.32 1.33.51 1.79.66.75.24 1.43.2 1.97.13.6-.09 1.83-.75 2.09-1.47.26-.73.26-1.35.18-1.48-.08-.13-.28-.21-.59-.36Z"/>
    </svg>
  );
}

export function WhatsAppFab({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed", bottom: "1.25rem", right: "1.25rem", zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        width: "3.5rem", height: "3.5rem", borderRadius: "50%", background: "#25d366", color: "#fff",
        boxShadow: "0 10px 24px -8px rgba(37,211,102,0.5)",
      }}
    >
      <WhatsAppIcon />
    </a>
  );
}

const PILLAR_ICONS: Record<string, LucideIcon> = { MessageCircle, Tag, ShoppingBag, MapPin, Clock3, BadgeDollarSign };

export function PillarIcon({ name, size = 26 }: { name: string; size?: number }) {
  const Icon = PILLAR_ICONS[name] ?? MessageCircle;
  return <Icon size={size} strokeWidth={1.8} aria-hidden="true" />;
}
