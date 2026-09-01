"use client";

import { useState } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NavLink } from "./nav-link";
import { logoutAction } from "./logout-action";
import type { ReactElement } from "react";

type Item = { href: string; label: string; icon: ReactElement<{ className?: string }>; exact?: boolean };

export default function DashboardSidebar({ groups, businessName, published, unhandledEnquiries }: { groups: { label: string; items: Item[] }[]; businessName: string; published: boolean; unhandledEnquiries: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[var(--gray-900)] text-[11px] font-bold text-[var(--background)]">L</span>
          <span className="max-w-[55vw] truncate text-[13px] font-semibold text-[var(--gray-900)]">{businessName}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button type="button" onClick={() => setOpen(true)} className="btn btn-secondary !p-2" aria-label="Open navigation"><Menu size={18} /></button>
        </div>
      </header>
      {open && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[var(--border-subtle)] bg-[var(--surface)] shadow-xl transition-transform md:static md:z-auto md:w-auto md:translate-x-0 md:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[var(--gray-900)] text-[11px] font-bold text-[var(--background)]">L</span>
            <span className="text-[13px] font-semibold text-[var(--gray-900)]">LaunchDesk</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="hidden md:inline"><ThemeToggle /></span>
            <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost !p-1.5 md:hidden" aria-label="Close navigation"><X size={18} /></button>
          </div>
        </div>
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
          {groups.map((group) => <div key={group.label}>
            <p className="px-2.5 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--gray-400)]">{group.label}</p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => <NavLink key={item.href} {...item} badge={item.href === "/dashboard/messages" ? unhandledEnquiries : undefined} onNavigate={() => setOpen(false)} />)}
            </div>
          </div>)}
        </nav>
        <div className="border-t border-[var(--border-subtle)] p-3">
          <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-muted)] p-3">
            <p className="truncate text-[13px] font-semibold text-[var(--gray-900)]">{businessName}</p>
            <span className={`badge mt-1.5 ${published ? "badge-success" : "badge-neutral"}`}><span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-[var(--gray-400)]"}`} />{published ? "Published" : "Draft"}</span>
            <form action={logoutAction} className="mt-3 border-t border-[var(--border-subtle)] pt-2.5"><button type="submit" className="flex w-full items-center gap-1.5 text-[12.5px] font-medium text-[var(--gray-500)] hover:text-[var(--gray-900)]"><LogOut size={13} />Sign out</button></form>
          </div>
        </div>
      </aside>
    </>
  );
}
