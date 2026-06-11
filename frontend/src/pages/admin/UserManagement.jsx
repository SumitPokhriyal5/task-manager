import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useAuth } from "../../context/useAuth";
import { useToast } from "../../components/useToast";
import PageHeader from "../../components/PageHeader";
import DataTable from "../../components/DataTable";
import Badge from "../../components/Badge";
import ConfirmDialog from "../../components/ConfirmDialog";
import Spinner from "../../components/Spinner";

const COLUMNS = ["User", "Role", "Status", "Joined", ""];

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const UserManagement = () => {
  const { user: me } = useAuth();
  const toast = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [togglingId, setTogglingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = () =>
    api
      .get("/admin/users")
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    let active = true;
    api
      .get("/admin/users")
      .then((data) => active && setUsers(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const reload = () => {
    setLoading(true);
    setError("");
    fetchUsers();
  };

  const toggleStatus = async (u) => {
    const next = u.status === "Active" ? "Inactive" : "Active";
    setTogglingId(u._id);
    try {
      const updated = await api.put(`/admin/users/${u._id}/status`, {
        status: next,
      });
      setUsers((list) => list.map((x) => (x._id === u._id ? updated : x)));
      toast(`${updated.name} set to ${next}`);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/admin/users/${deleteTarget._id}`);
      setUsers((list) => list.filter((x) => x._id !== deleteTarget._id));
      toast("User deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const renderRow = (u) => {
    const isMe = u._id === me?.id;
    const initials = u.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <tr key={u._id} className="transition hover:bg-slatebg/50">
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">
                {u.name}
                {isMe && (
                  <span className="ml-2 text-xs font-normal text-muted">
                    (you)
                  </span>
                )}
              </p>
              <p className="truncate text-xs text-muted">{u.email}</p>
            </div>
          </div>
        </td>
        <td className="px-5 py-4">
          <Badge>{u.role}</Badge>
        </td>
        <td className="px-5 py-4">
          <Badge>{u.status}</Badge>
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-sm text-muted">
          {formatDate(u.createdAt)}
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => toggleStatus(u)}
              disabled={isMe || togglingId === u._id}
              title={isMe ? "You can't change your own status" : ""}
              className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:bg-slatebg hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              {togglingId === u._id && <Spinner className="h-3 w-3" />}
              {u.status === "Active" ? "Deactivate" : "Activate"}
            </button>
            <button
              onClick={() => setDeleteTarget(u)}
              disabled={isMe}
              title={isMe ? "You can't delete your own account" : ""}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-danger/30 hover:bg-danger-soft hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle={
          loading
            ? "Loading members…"
            : `${users.length} member${users.length === 1 ? "" : "s"} in the workspace.`
        }
      />

      <DataTable
        columns={COLUMNS}
        rows={users}
        loading={loading}
        error={error}
        onRetry={reload}
        empty="No users found."
        renderRow={renderRow}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete user"
        message={`${deleteTarget?.name}'s account and all their tasks will be permanently removed. This can't be undone.`}
        confirmLabel="Delete user"
        busy={deleting}
      />
    </>
  );
};

export default UserManagement;
