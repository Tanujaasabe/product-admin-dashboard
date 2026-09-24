"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProduct } from "../../../lib/products";
import { ErrorState, Loader } from "../../../components/States";

export default function ProductDetails({ params }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await getProduct(params.id);
      if (!data?.id) throw new Error("Not found");
      setProduct(data);
    } catch {
      setError("Product not found.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [params.id]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <div className="rounded bg-white p-6 shadow">
      <div className="mb-4 flex justify-between">
        <h2 className="text-2xl font-bold">{product.title}</h2>
        <Link href="/products" className="rounded bg-slate-800 px-4 py-2 text-white">Back</Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <div className="grid grid-cols-2 gap-3">
            {(product.images || []).map((img) => (
              <img key={img} src={img} alt={product.title} className="h-48 w-full rounded object-cover" />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3">{product.description}</p>
          <p><b>Price:</b> ${product.price}</p>
          <p><b>Category:</b> {product.category}</p>
          <p><b>Rating:</b> {product.rating}</p>
          <p><b>Stock:</b> {product.stock}</p>

          <h3 className="mt-6 text-xl font-bold">Reviews</h3>
          <div className="mt-3 space-y-3">
            {(product.reviews || []).length === 0 && <p>No reviews found.</p>}
            {(product.reviews || []).map((review, i) => (
              <div key={i} className="rounded border p-3">
                <p className="font-semibold">{review.reviewerName || review.user?.fullName || "User"}</p>
                <p>Rating: {review.rating}</p>
                <p>{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
