import Modal from "./Modal";
import Spinner from "./Spinner";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  busy,
}) => (
  <Modal open={open} onClose={onClose} title={title}>
    <p className="text-sm text-muted">{message}</p>
    <div className="mt-6 flex justify-end gap-3">
      <button
        onClick={onClose}
        className="rounded-xl border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-slatebg hover:text-ink"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        disabled={busy}
        className="flex items-center gap-2 rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {busy && <Spinner />}
        {confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
