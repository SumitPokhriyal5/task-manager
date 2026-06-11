import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { useToast } from "../../components/useToast";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import Badge from "../../components/Badge";
import ConfirmDialog from "../../components/ConfirmDialog";

const COLUMNS = ["Task", "Owner", "Status", "Created", ""];
const FILTERS = ["All", "Pending", "Completed"];

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const TaskMonitoring = () => {
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = () =>
    api
      .get("/admin/tasks")
      .then(setTasks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    let active = true;
    api
      .get("/admin/tasks")
      .then((data) => active && setTasks(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const reload = () => {
    setLoading(true);
    setError("");
    fetchTasks();
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/admin/tasks/${deleteTarget._id}`);
      setTasks((list) => list.filter((x) => x._id !== deleteTarget._id));
      toast("Task deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      const matchesFilter = filter === "All" || t.status === filter;
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.owner?.name?.toLowerCase().includes(q) ||
        t.owner?.email?.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [tasks, filter, query]);

  const renderRow = (t) => {
    const initials = t.owner?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <tr key={t._id} className="transition hover:bg-slatebg/50">
        <td className="px-5 py-4">
          <p className="font-medium text-ink">{t.title}</p>
          {t.description && (
            <p className="mt-0.5 max-w-xs truncate text-xs text-muted">
              {t.description}
            </p>
          )}
        </td>
        <td className="px-5 py-4">
          {t.owner ? (
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink">
                  {t.owner.name}
                </p>
                <p className="truncate text-xs text-muted">{t.owner.email}</p>
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted">Unknown</span>
          )}
        </td>
        <td className="px-5 py-4">
          <Badge>{t.status}</Badge>
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
          {formatDate(t.createdAt)}
        </td>
        <td className="px-5 py-4 text-right">
          <button
            onClick={() => setDeleteTarget(t)}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-danger/30 hover:bg-danger-soft hover:text-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  };

  return (
    <>
      <PageHeader
        title="Task Monitoring"
        subtitle={
          loading
            ? "Loading tasks…"
            : `${tasks.length} task${tasks.length === 1 ? "" : "s"} across all members.`
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl border border-line bg-surface p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? "rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-white"
                  : "rounded-lg px-4 py-1.5 text-sm font-medium text-muted transition hover:text-ink"
              }
            >
              {f}
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
            placeholder="Search task or owner…"
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
            ? "No tasks match your filters."
            : "No tasks created yet."
        }
        renderRow={renderRow}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete task"
        message={`"${deleteTarget?.title}" by ${deleteTarget?.owner?.name || "unknown user"} will be permanently removed. This can't be undone.`}
        confirmLabel="Delete task"
        busy={deleting}
      />
    </>
  );
};

export default TaskMonitoring;
