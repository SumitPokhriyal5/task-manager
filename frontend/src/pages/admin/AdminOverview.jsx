import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import PageHeader from "../../components/PageHeader";
import StatCard from "../../components/StatCard";
import Skeleton from "../../components/Skeleton";

const actionLabels = {
  LOGIN: "signed in",
  TASK_CREATE: "created a task",
  TASK_UPDATE: "updated a task",
  TASK_DELETE: "deleted a task",
};

const timeAgo = (date) => {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([api.get("/admin/stats"), api.get("/admin/logs")])
      .then(([s, l]) => {
        if (!active) return;
        setStats(s);
        setLogs(l.slice(0, 6));
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle="A snapshot of everything happening across the workspace."
      />

      {error ? (
        <div className="rounded-2xl border border-danger/20 bg-danger-soft p-6 text-center text-sm font-medium text-danger">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Total users"
              value={stats?.totalUsers}
              accent="primary"
              icon={UsersIcon}
              iconWrap="bg-primary-soft text-primary"
              loading={loading}
            />
            <StatCard
              label="Total tasks"
              value={stats?.totalTasks}
              accent="ink"
              icon={TaskIcon}
              iconWrap="bg-slatebg text-ink"
              loading={loading}
            />
            <StatCard
              label="Completed"
              value={stats?.completedTasks}
              accent="success"
              icon={CheckIcon}
              iconWrap="bg-success-soft text-success"
              loading={loading}
            />
            <StatCard
              label="Pending"
              value={stats?.pendingTasks}
              accent="warning"
              icon={ClockIcon}
              iconWrap="bg-warning-soft text-warning"
              loading={loading}
            />
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-ink">
                Recent activity
              </h2>
              <a
                href="/admin/logs"
                className="text-sm font-semibold text-primary hover:text-primary-hover"
              >
                View all
              </a>
            </div>

            <div className="rounded-2xl border border-line bg-surface p-2 shadow-card">
              {loading ? (
                <div className="space-y-1 p-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12" />
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <p className="p-8 text-center text-sm text-muted">
                  No activity recorded yet.
                </p>
              ) : (
                <ul className="divide-y divide-line">
                  {logs.map((log) => (
                    <li
                      key={log._id}
                      className="flex items-center gap-3 px-3 py-3"
                    >
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                        {log.user?.name
                          ?.split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-ink">
                          <span className="font-medium">
                            {log.user?.name || "Unknown"}
                          </span>{" "}
                          <span className="text-muted">
                            {actionLabels[log.action] || log.action}
                          </span>
                        </p>
                        {log.detail && (
                          <p className="truncate text-xs text-muted">
                            {log.detail}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs text-muted">
                        {timeAgo(log.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

function UsersIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}
function TaskIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}
function CheckIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
function ClockIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export default AdminOverview;
