export default function Pagination({ page, total, onChange }) {
    if (total <= 1) return null;
    return (
      <div className="pagination">
        <button disabled={page === 1} onClick={() => onChange(page - 1)}>← Prev</button>
        <span>Page {page} / {total}</span>
        <button disabled={page === total} onClick={() => onChange(page + 1)}>Next →</button>
      </div>
    );
  }
  