import * as React from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid,
  Inbox,
  FileSpreadsheet,
  Sparkles,
  Settings,
  Moon,
  Sun,
  Search,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Today", icon: LayoutGrid },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/import", label: "Import", icon: FileSpreadsheet },
  { to: "/work", label: "Work mode", icon: Sparkles },
];

function useTheme() {
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");
  React.useEffect(() => {
    const stored = (localStorage.getItem("avara-theme") as "dark" | "light" | null) ?? "dark";
    setTheme(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("avara-theme", next);
  };
  return { theme, toggle };
}

export function Shell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const { theme, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full">
      {/* Rail */}
      <aside className="hidden md:flex w-[224px] shrink-0 flex-col border-r hairline bg-[var(--surface-1)]/60 backdrop-blur-xl">
        <div className="px-5 pt-6 pb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative h-7 w-7 rounded-lg bg-gradient-to-br from-coral to-purple grid place-items-center">
              <div className="absolute inset-[3px] rounded-md bg-[var(--surface-1)]" />
              <span className="relative font-semibold text-[13px] tracking-tight">A</span>
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">Avara</div>
              <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                by Avitus Leads
              </div>
            </div>
          </Link>
        </div>

        <nav className="px-3 flex flex-col gap-0.5">
          {nav.map((n) => {
            const Icon = n.icon;
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition",
                  active
                    ? "bg-[var(--surface-2)] text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-[var(--surface-2)]/60",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{n.label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-coral" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 px-5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground mb-2">
            Studio
          </div>
          <button className="w-full flex items-center justify-between rounded-lg border hairline bg-[var(--surface-2)]/60 px-3 py-2 text-left">
            <div>
              <div className="text-[13px] font-medium">Mendes & Co.</div>
              <div className="text-[11px] text-muted-foreground">Interior · Lisbon</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="mt-auto p-3">
          <div className="flex items-center gap-2 rounded-lg border hairline bg-[var(--surface-2)]/40 p-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple/70 to-coral/70 grid place-items-center text-[12px] font-semibold">
              AM
            </div>
            <div className="leading-tight">
              <div className="text-[12.5px] font-medium">Ana Mendes</div>
              <div className="text-[10.5px] text-muted-foreground">Owner</div>
            </div>
            <button className="ml-auto rounded-md p-1.5 hover:bg-[var(--surface-2)]">
              <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 border-b hairline bg-[var(--background)]/70 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-6 h-14">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {subtitle ?? "Avara"}
              </div>
              <h1 className="text-[15px] font-semibold tracking-tight truncate">{title}</h1>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 rounded-lg border hairline bg-[var(--surface-2)]/50 px-3 h-9 w-[260px]">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  placeholder="Search leads, projects…"
                  className="bg-transparent text-[13px] outline-none flex-1 placeholder:text-muted-foreground"
                />
                <kbd className="text-[10px] text-muted-foreground border hairline rounded px-1.5 py-0.5">
                  ⌘K
                </kbd>
              </div>
              <button
                onClick={toggle}
                className="h-9 w-9 grid place-items-center rounded-lg border hairline bg-[var(--surface-2)]/50 hover:bg-[var(--surface-2)]"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
