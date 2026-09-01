import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 px-6 text-center bg-[var(--surface-muted)]">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="animate-rise-in flex flex-col items-center gap-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-600)]">
          CLIENT WEBSITE MANAGEMENT
        </p>
        <h1 className="text-2xl font-bold text-[var(--gray-900)]">LaunchDesk</h1>
        <p className="text-sm text-[var(--gray-500)]">
          Client dashboards and the agency admin panel both live behind sign-in.
        </p>
        <Link
          href="/login"
          className="btn btn-primary px-5 py-2.5 text-sm hover-lift"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
