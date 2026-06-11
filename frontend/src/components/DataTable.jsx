import Skeleton from "./Skeleton";

const DataTable = ({
  columns,
  rows,
  loading,
  error,
  empty,
  onRetry,
  renderRow,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-slatebg/50">
              {columns.map((col) => (
                <th
                  key={col}
                  className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c} className="px-5 py-4">
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <p className="text-sm font-medium text-danger">{error}</p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="mt-2 text-sm font-semibold text-danger underline"
                    >
                      Try again
                    </button>
                  )}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-12 text-center text-sm text-muted"
                >
                  {empty || "Nothing to show yet."}
                </td>
              </tr>
            ) : (
              rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
