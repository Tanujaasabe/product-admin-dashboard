export function Loader() {
  return <div className="p-8 text-center">Loading...</div>;
}

export function Empty({ message = "No products found." }) {
  return <div className="rounded bg-white p-8 text-center shadow">{message}</div>;
}

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="rounded bg-red-50 p-6 text-center text-red-700">
      <p>{message}</p>
      <button onClick={onRetry} className="mt-3 rounded bg-red-600 px-4 py-2 text-white">
        Retry
      </button>
    </div>
  );
}
