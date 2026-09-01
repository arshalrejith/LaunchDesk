import { LogOut } from "lucide-react";
import { requireAgencyAdmin } from "@/lib/scope";
import { logoutAction } from "@/app/dashboard/logout-action";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAgencyAdmin();

  return (
    <div className="min-h-screen bg-[var(--surface-muted)]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)]/80 px-6 py-3.5 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[var(--gray-900)] text-[11px] font-bold text-[var(--background)]">
            A
          </span>
          <span className="text-[13px] font-semibold text-[var(--gray-900)]">Agency Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--gray-500)] hover:text-[var(--gray-900)]"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6 md:p-10 animate-fade-in">{children}</main>
    </div>
  );
}
