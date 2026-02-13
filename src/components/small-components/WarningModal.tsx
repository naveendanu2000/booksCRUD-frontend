type ConfirmModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  setOpen: (x: boolean) => void;
  onConfirm?: () => void;
  loading?: boolean;
};

export function WarningModal({
  open,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  setOpen,
  onConfirm,
  loading = false,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setOpen(false)}
      />

      <div className="relative w-full max-w-sm rounded-lg bg-white p-10 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

        <p className="mt-2 text-sm text-gray-600">{message}</p>

        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded bg-red-600 shadow px-4 py-2 text-sm text-white
                       hover:bg-red-700 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="rounded shadow bg-amber-300 px-4 py-2 text-sm
                     hover:bg-yellow-400 hover:shadow-lg disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
