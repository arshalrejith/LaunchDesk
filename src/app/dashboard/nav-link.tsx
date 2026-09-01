"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cloneElement, isValidElement } from "react";
import type { ReactElement } from "react";

export function NavLink({
  href,
  label,
  icon,
  exact,
  badge,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: ReactElement<{ className?: string }>;
  exact?: boolean;
  /** Unread-style count shown as a small pill after the label — e.g. unhandled enquiries. Omitted when falsy. */
  badge?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={[
        "group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] font-medium transition-all duration-150",
        active
          ? "bg-[var(--surface)] text-[var(--gray-900)] shadow-[0_1px_2px_rgba(0,0,0,0.06)] ring-1 ring-[var(--border-subtle)]"
          : "text-[var(--gray-500)] hover:bg-[var(--gray-100)] hover:text-[var(--gray-900)] hover:translate-x-0.5",
      ].join(" ")}
    >
      {isValidElement(icon)
        ? cloneElement(icon, {
            className: active ? "text-[var(--accent-600)]" : "text-[var(--gray-400)] group-hover:text-[var(--gray-500)]",
          })
        : icon}
      <span className="flex-1">{label}</span>
      {!!badge && (
        <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}
