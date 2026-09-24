"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "../../../../components/ProductForm";
import {
  getProduct,
  updateProduct,
  saveProductOverride,
  getProductOverrides
} from "../../../../lib/products";
import { Loader } from "../../../../components/States";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const local = getProductOverrides()[String(params.id)];
        if (local) {
          setProduct(local);
          return;
        }

        const data = await getProduct(params.id);
        if (!data?.id) throw new Error("Not found");
        setProduct(data);
      } catch {
        setError("Product not found.");
      }
    }

    load();
  }, [params.id]);

  async function save(values) {
    if (saving) return;
    setSaving(true);
    setError("");

    try {
      const apiProduct = await updateProduct(params.id, values);

      const finalProduct = {
        ...product,
        ...apiProduct,
        ...values,
        id: product.id
      };

      saveProductOverride(finalProduct);

      alert("Product updated successfully.");
      router.push("/products");
    } catch (err) {
      console.error(err);
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (!product && !error) return <Loader />;

  if (error) {
    return <p className="rounded bg-red-50 p-4 text-red-700">{error}</p>;
  }

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold">Edit Product</h2>
      <ProductForm initial={product} onSave={save} saving={saving} />
    </div>
  );
}
