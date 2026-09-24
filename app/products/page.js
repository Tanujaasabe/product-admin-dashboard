"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  deleteProduct,
  getCategories,
  getProducts,
  searchProducts,
  saveDeletedProductId,
  getDeletedProductIds,
  getProductOverrides,
  getAddedProducts
} from "../../lib/products";
import ProductTable from "../../components/ProductTable";
import Pagination from "../../components/Pagination";
import { Empty, ErrorState, Loader } from "../../components/States";

const TOTAL_FALLBACK = 194;

function validPage(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}

function validSize(value) {
  const n = Number(value);
  return [10, 20, 50].includes(n) ? n : 10;
}

export default function ProductsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const page = validPage(params.get("page"));
  const pageSize = validSize(params.get("size"));
  const search = params.get("search") || "";
  const category = params.get("category") || "";
  const sort = params.get("sort") || "";

  const [input, setInput] = useState(search);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState({ products: [], total: TOTAL_FALLBACK });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  useEffect(() => setInput(search), [search]);

  function updateUrl(values) {
    const next = new URLSearchParams(params.toString());
    Object.entries(values).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const load = useCallback(async () => {
    const currentId = ++requestId.current;
    setLoading(true);
    setError("");

    try {
      const skip = (page - 1) * pageSize;
      const apiParams = { limit: pageSize, skip };
      let result;

      if (search.trim()) {
        result = await searchProducts(search.trim(), apiParams);
      } else {
        result = await getProducts(apiParams);
      }

      if (currentId !== requestId.current) return;

      const overrides = getProductOverrides();
      const deletedIds = new Set(getDeletedProductIds());
      const addedProducts = getAddedProducts();

      let products = (result.products || [])
        .map((product) => overrides[String(product.id)] || product)
        .filter((product) => !deletedIds.has(String(product.id)));

      if (!search.trim() && page === 1) {
        products = [...addedProducts, ...products];
      }

      if (category && !search.trim()) {
        products = products.filter((p) => p.category === category);
      }

      if (sort) {
        const [field, direction] = sort.split("-");
        products = [...products].sort((a, b) => {
          const av = field === "title" ? String(a.title).toLowerCase() : Number(a[field]);
          const bv = field === "title" ? String(b.title).toLowerCase() : Number(b[field]);
          const comparison = av > bv ? 1 : av < bv ? -1 : 0;
          return direction === "desc" ? -comparison : comparison;
        });
      }

      const apiTotal = result.total || TOTAL_FALLBACK;
      const localAddedCount = !search.trim() ? addedProducts.length : 0;
      const deletedCount = !search.trim() ? getDeletedProductIds().length : 0;

      setData({
        products,
        total: Math.max(0, apiTotal + localAddedCount - deletedCount)
      });
    } catch (err) {
      if (err.code === "ERR_CANCELED") return;
      if (currentId !== requestId.current) return;
      setError("Unable to load products.");
    } finally {
      if (currentId === requestId.current) setLoading(false);
    }
  }, [page, pageSize, search, category, sort]);

  useEffect(() => {
    const timer = setTimeout(load, 400);
    return () => clearTimeout(timer);
  }, [load]);

  function handleSearchChange(value) {
    setInput(value);
    updateUrl({ search: value, page: 1 });
  }

  function handlePage(newPage) {
    const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
    if (newPage < 1 || newPage > totalPages) return;
    updateUrl({ page: newPage });
  }

  function handleSize(size) {
    updateUrl({ size, page: 1 });
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.title}"?`)) return;

    try {
      await deleteProduct(product.id);
      saveDeletedProductId(product.id);
      await load();
    } catch (err) {
      console.error(err);
      setError("Delete failed. Please try again.");
    }
  }

  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (!loading && page > totalPages) {
      updateUrl({ page: totalPages });
    }
    // updateUrl is intentionally omitted because it changes with URL state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, page, totalPages]);

  const start = data.total ? (safePage - 1) * pageSize + 1 : 0;
  const end = Math.min(safePage * pageSize, data.total);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-slate-600">Showing {start}–{end} of {data.total}</p>
        </div>
        <Link href="/products/new" className="rounded bg-green-600 px-4 py-2 text-white">Add Product</Link>
      </div>

      <div className="mb-5 grid gap-3 rounded bg-white p-4 shadow md:grid-cols-3">
        <input
          value={input}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search products..."
          className="rounded border p-2"
        />

        <select
          value={category}
          onChange={(e) => updateUrl({ category: e.target.value, page: 1 })}
          className="rounded border p-2"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={typeof c === "string" ? c : c.slug} value={typeof c === "string" ? c : c.slug}>
              {typeof c === "string" ? c : c.name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => updateUrl({ sort: e.target.value, page: 1 })}
          className="rounded border p-2"
        >
          <option value="">Sort</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="title-asc">Title: A to Z</option>
        </select>
      </div>

      {loading && <Loader />}
      {!loading && error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && data.products.length === 0 && <Empty />}

      {!loading && !error && data.products.length > 0 && (
        <>
          <ProductTable products={data.products} onDelete={handleDelete} />
          <Pagination
            page={safePage}
            totalPages={totalPages}
            pageSize={pageSize}
            setPage={handlePage}
            setPageSize={handleSize}
          />
        </>
      )}

      {search && (
        <p className="mt-4 text-sm text-slate-500">
          Search takes priority while typing because DummyJSON does not support search and category filtering together in one API request.
        </p>
      )}
    </div>
  );
}
