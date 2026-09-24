import Link from "next/link";

export default function ProductTable({ products, onDelete }) {
  return (
    <div className="overflow-x-auto rounded bg-white shadow">
      <table className="hidden w-full md:table">
        <thead className="bg-slate-100 text-left">
          <tr>
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Price</th>
            <th className="p-3">Rating</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3"><img src={p.thumbnail} alt={p.title} className="h-12 w-12 rounded object-cover" /></td>
              <td className="p-3 font-medium">{p.title}</td>
              <td className="p-3">{p.category}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">{p.rating}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Link className="rounded bg-blue-600 px-3 py-1 text-white" href={`/products/${p.id}`}>View</Link>
                  <Link className="rounded bg-green-600 px-3 py-1 text-white" href={`/products/${p.id}/edit`}>Edit</Link>
                  <button onClick={() => onDelete(p)} className="rounded bg-red-600 px-3 py-1 text-white">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid gap-4 p-4 md:hidden">
        {products.map((p) => (
          <div key={p.id} className="rounded border p-4">
            <img src={p.thumbnail} alt={p.title} className="mb-3 h-40 w-full rounded object-cover" />
            <h2 className="font-bold">{p.title}</h2>
            <p>Category: {p.category}</p>
            <p>Price: ${p.price}</p>
            <p>Rating: {p.rating}</p>
            <p>Stock: {p.stock}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Link className="rounded bg-blue-600 px-3 py-1 text-white" href={`/products/${p.id}`}>View</Link>
              <Link className="rounded bg-green-600 px-3 py-1 text-white" href={`/products/${p.id}/edit`}>Edit</Link>
              <button onClick={() => onDelete(p)} className="rounded bg-red-600 px-3 py-1 text-white">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
