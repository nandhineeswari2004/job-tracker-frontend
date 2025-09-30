export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="flex gap-2 items-center justify-center mt-6">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Prev
      </button>

      <span>Page {page} of {totalPages}</span>

      <button
        className="px-3 py-1 border rounded disabled:opacity-50"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
