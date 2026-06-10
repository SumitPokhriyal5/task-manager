import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Sidebar from "./Sidebar";
import { cn } from "../lib/cn";

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-line bg-surface lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar />
        </div>
      </aside>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[260px] bg-surface shadow-pop animate-fade-in">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-surface/80 px-4 py-3 backdrop-blur lg:px-8">
          <button
            onClick={() => setDrawerOpen(true)}
            className="rounded-lg p-2 text-muted hover:bg-slatebg hover:text-ink lg:hidden"
            aria-label="Open menu"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium leading-tight text-ink">
                {user?.name}
              </p>
              <span
                className={cn(
                  "text-xs font-medium",
                  user?.role === "Admin" ? "text-primary" : "text-muted",
                )}
              >
                {user?.role}
              </span>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
              {initials}
            </div>
            <button
              onClick={logout}
              className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-muted transition hover:border-danger/30 hover:bg-danger-soft hover:text-danger"
            >
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
