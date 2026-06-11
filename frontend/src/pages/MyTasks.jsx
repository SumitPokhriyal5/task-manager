import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useToast } from "../components/useToast";
import PageHeader from "../components/PageHeader";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import Skeleton from "../components/Skeleton";
import Spinner from "../components/Spinner";

const FILTERS = ["All", "Pending", "Completed"];

const MyTasks = () => {
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = async () => {
    try {
      setTasks(await api.get("/tasks"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    api
      .get("/tasks")
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

  const openCreate = () => {
    setEditing("new");
    setForm({ title: "", description: "", status: "Pending" });
  };

  const openEdit = (task) => {
    setEditing(task._id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
    });
  };

  const closeModal = () => setEditing(null);

  const saveTask = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing === "new") {
        const created = await api.post("/tasks", form);
        setTasks((t) => [created, ...t]);
        toast("Task created");
      } else {
        const updated = await api.put(`/tasks/${editing}`, form);
        setTasks((t) => t.map((x) => (x._id === editing ? updated : x)));
        toast("Task updated");
      }
      closeModal();
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (task) => {
    const next = task.status === "Completed" ? "Pending" : "Completed";
    try {
      const updated = await api.put(`/tasks/${task._id}`, { status: next });
      setTasks((t) => t.map((x) => (x._id === task._id ? updated : x)));
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/tasks/${deleteTarget._id}`);
      setTasks((t) => t.filter((x) => x._id !== deleteTarget._id));
      toast("Task deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const visible = tasks.filter((t) => filter === "All" || t.status === filter);

  return (
    <>
      <PageHeader
        title="My Tasks"
        subtitle="Everything on your plate, in one place."
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-primary-hover"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New task
          </button>
        }
      />

      <div className="mb-5 inline-flex rounded-xl border border-line bg-surface p-1">
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

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-danger/20 bg-danger-soft p-6 text-center">
          <p className="text-sm font-medium text-danger">{error}</p>
          <button
            onClick={reload}
            className="mt-3 text-sm font-semibold text-danger underline"
          >
            Try again
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
          </div>
          <p className="font-display font-semibold text-ink">
            {filter === "All"
              ? "No tasks yet"
              : `No ${filter.toLowerCase()} tasks`}
          </p>
          <p className="mt-1 text-sm text-muted">
            {filter === "All"
              ? "Create your first task to get started."
              : "Nothing here right now."}
          </p>
          {filter === "All" && (
            <button
              onClick={openCreate}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              New task
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {visible.map((task) => (
            <div
              key={task._id}
              className="group rounded-2xl border border-line bg-surface p-5 shadow-card transition hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => toggleStatus(task)}
                  aria-label="Toggle complete"
                  className={
                    task.status === "Completed"
                      ? "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-success text-white"
                      : "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 border-line transition hover:border-primary"
                  }
                >
                  {task.status === "Completed" && (
                    <svg
                      className="h-3 w-3"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <h3
                    className={
                      task.status === "Completed"
                        ? "font-semibold text-muted line-through"
                        : "font-semibold text-ink"
                    }
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="mt-1 text-sm text-muted line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
                <Badge>{task.status}</Badge>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2 opacity-0 transition group-hover:opacity-100">
                <button
                  onClick={() => openEdit(task)}
                  className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-slatebg hover:text-ink"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(task)}
                  className="rounded-lg px-2.5 py-1 text-xs font-medium text-muted transition hover:bg-danger-soft hover:text-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={closeModal}
        title={editing === "new" ? "New task" : "Edit task"}
      >
        <form onSubmit={saveTask} className="space-y-4">
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-ink"
              htmlFor="title"
            >
              Title
            </label>
            <input
              id="title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs doing?"
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm transition focus:border-primary"
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-ink"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Add any details (optional)"
              className="w-full resize-none rounded-xl border border-line bg-surface px-4 py-2.5 text-sm transition focus:border-primary"
            />
          </div>
          <div>
            <label
              className="mb-1.5 block text-sm font-medium text-ink"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm transition focus:border-primary"
            >
              <option>Pending</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-slatebg hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
            >
              {saving && <Spinner />}
              {editing === "new" ? "Create task" : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete task"
        message={`"${deleteTarget?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete task"
        busy={deleting}
      />
    </>
  );
};

export default MyTasks;
