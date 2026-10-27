function Pagination({ page, totalPages, loading, onPageChange }) {
  return (
    <nav className="pagination" aria-label="Task pages">
      <button
        type="button"
        className="secondary-button"
        onClick={() => onPageChange(page - 1)}
        disabled={loading || page <= 1}
      >
        Previous
      </button>

      <span>
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        className="secondary-button"
        onClick={() => onPageChange(page + 1)}
        disabled={loading || page >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
