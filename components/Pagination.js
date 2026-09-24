export default function Pagination({ page, totalPages, pageSize, setPage, setPageSize }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
      <button className="rounded border bg-white px-3 py-2" disabled={page === 1} onClick={() => setPage(page - 1)}>
        Previous
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`rounded border px-3 py-2 ${p === page ? "bg-blue-600 text-white" : "bg-white"}`}
          onClick={() => setPage(p)}
        >
          {p}
        </button>
      ))}
      <button className="rounded border bg-white px-3 py-2" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
        Next
      </button>
      <select className="rounded border bg-white px-3 py-2" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  );
}
