import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import { cn } from "../../lib/cn";

const COLUMNS = ["Event", "User", "Details", "When"];
const FILTERS = [
  { value: "All", label: "All" },
  { value: "LOGIN", label: "Logins" },
  { value: "TASK_CREATE", label: "Created" },
  { value: "TASK_UPDATE", label: "Updated" },
  { value: "TASK_DELETE", label: "Deleted" },
];

const actionMeta = {
  LOGIN: {
    label: "Signed in",
    icon: LoginIcon,
    color: "bg-primary-soft text-primary",
  },
  TASK_CREATE: {
    label: "Created task",
    icon: PlusIcon,
    color: "bg-success-soft text-success",
  },
  TASK_UPDATE: {
    label: "Updated task",
    icon: EditIcon,
    color: "bg-warning-soft text-warning",
  },
  TASK_DELETE: {
    label: "Deleted task",
    icon: TrashIcon,
    color: "bg-danger-soft text-danger",
  },
};

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

const formatExact = (date) =>
  new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const fetchLogs = () =>
    api
      .get("/admin/logs")
      .then(setLogs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    let active = true;
    api
      .get("/admin/logs")
      .then((data) => active && setLogs(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const reload = () => {
    setLoading(true);
    setError("");
    fetchLogs();
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs.filter((l) => {
      const matchesFilter = filter === "All" || l.action === filter;
      const matchesQuery =
        !q ||
        l.user?.name?.toLowerCase().includes(q) ||
        l.user?.email?.toLowerCase().includes(q) ||
        l.detail?.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [logs, filter, query]);

  const renderRow = (log) => {
    const meta = actionMeta[log.action] || {
      label: log.action,
      icon: PulseIcon,
      color: "bg-slatebg text-muted",
    };
    const Icon = meta.icon;
    const initials = log.user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <tr key={log._id} className="transition hover:bg-slatebg/50">
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                meta.color,
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-ink">{meta.label}</span>
          </div>
        </td>
        <td className="px-5 py-4">
          {log.user ? (
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {log.user.name}
                </p>
                <p className="truncate text-xs text-muted">{log.user.email}</p>
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted">Deleted user</span>
          )}
        </td>
        <td className="px-5 py-4">
          <p className="max-w-md truncate text-sm text-muted">
            {log.detail || "—"}
          </p>
        </td>
        <td
          className="whitespace-nowrap px-5 py-4 text-sm text-muted"
          title={formatExact(log.createdAt)}
        >
          {timeAgo(log.createdAt)}
        </td>
      </tr>
    );
  };

  return (
    <>
      <PageHeader
        title="Activity"
        subtitle={
          loading
            ? "Loading events…"
            : `${logs.length} event${logs.length === 1 ? "" : "s"} recorded. Showing the latest 200.`
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={
                filter === f.value
                  ? "rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-white"
                  : "rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted transition hover:text-ink"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user or detail…"
            className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-sm transition focus:border-primary"
          />
        </div>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={visible}
        loading={loading}
        error={error}
        onRetry={reload}
        empty={
          query || filter !== "All"
            ? "No events match your filters."
            : "No activity recorded yet."
        }
        renderRow={renderRow}
      />
    </>
  );
};

function LoginIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
    </svg>
  );
}
function PlusIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
function EditIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function TrashIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}
function PulseIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export default ActivityLogs;
