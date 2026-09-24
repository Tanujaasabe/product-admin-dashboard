"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ProductForm from "../../../components/ProductForm";
import { addProduct, saveAddedProduct } from "../../../lib/products";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function save(product) {
    if (saving) return;
    setSaving(true);

    try {
      const created = await addProduct(product);
      const localProduct = {
        ...created,
        ...product,
        id: created?.id || Date.now()
      };

      saveAddedProduct(localProduct);
      alert("Product added successfully.");
      router.push("/products");
    } catch (err) {
      console.error(err);
      alert("Unable to add product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold">Add Product</h2>
      <ProductForm onSave={save} saving={saving} />
    </div>
  );
}
