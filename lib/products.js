import api from "./api";

export async function login(username, password) {
  const { data } = await api.post("/auth/login", {
    username,
    password,
    expiresInMins: 30
  });
  return data;
}

export async function getProducts(params, signal) {
  const { data } = await api.get("/products", { params, signal });
  return data;
}

export async function searchProducts(query, params, signal) {
  const { data } = await api.get("/products/search", {
    params: { q: query, ...params },
    signal
  });
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data;
}

export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

export async function addProduct(product) {
  const { data } = await api.post("/products/add", product);
  return data;
}

export async function updateProduct(id, product) {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

// DummyJSON does not persist POST/PUT/DELETE changes.
// These helpers keep mutation results visible in this browser.
export function getProductOverrides() {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem("productOverrides") || "{}");
}

export function saveProductOverride(product) {
  const overrides = getProductOverrides();
  overrides[String(product.id)] = product;
  localStorage.setItem("productOverrides", JSON.stringify(overrides));
}

export function getAddedProducts() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("addedProducts") || "[]");
}

export function saveAddedProduct(product) {
  const products = getAddedProducts();
  products.unshift(product);
  localStorage.setItem("addedProducts", JSON.stringify(products));
}

export function getDeletedProductIds() {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("deletedProductIds") || "[]");
}

export function saveDeletedProductId(id) {
  const ids = getDeletedProductIds();
  const value = String(id);
  if (!ids.includes(value)) ids.push(value);
  localStorage.setItem("deletedProductIds", JSON.stringify(ids));
}
