"use client";

import { useState } from "react";

export default function ProductForm({ initial = {}, onSave, saving = false }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    price: initial.price ?? "",
    category: initial.category || "",
    stock: initial.stock ?? "",
    description: initial.description || ""
  });
  const [error, setError] = useState("");

  function change(e) {
    setForm((old) => ({ ...old, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    if (saving) return;

    const title = form.title.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!title) {
      setError("Title is required.");
      return;
    }
    if (form.price === "" || !Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }
    if (form.stock === "" || !Number.isFinite(stock) || stock < 0) {
      setError("Enter a valid stock.");
      return;
    }

    setError("");
    onSave({
      title,
      price,
      category: form.category.trim(),
      stock,
      description: form.description.trim()
    });
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-2xl space-y-4 rounded bg-white p-6 shadow">
      {error && <p className="rounded bg-red-50 p-3 text-red-700">{error}</p>}

      <div>
        <label className="mb-1 block font-medium">Title</label>
        <input name="title" value={form.title} onChange={change} className="w-full rounded border p-2" required />
      </div>

      <div>
        <label className="mb-1 block font-medium">Price</label>
        <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} className="w-full rounded border p-2" required />
      </div>

      <div>
        <label className="mb-1 block font-medium">Category</label>
        <input name="category" value={form.category} onChange={change} className="w-full rounded border p-2" />
      </div>

      <div>
        <label className="mb-1 block font-medium">Stock</label>
        <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={change} className="w-full rounded border p-2" required />
      </div>

      <div>
        <label className="mb-1 block font-medium">Description</label>
        <textarea name="description" value={form.description} onChange={change} className="w-full rounded border p-2" rows="5" />
      </div>

      <button type="submit" disabled={saving} className="rounded bg-blue-600 px-5 py-2 text-white">
        {saving ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
