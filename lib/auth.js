export function isLoggedIn() {
  return typeof window !== "undefined" && !!localStorage.getItem("token");
}

export function saveAuth(data) {
  localStorage.setItem("token", data.token || data.accessToken || "");
  localStorage.setItem("user", JSON.stringify(data));
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
