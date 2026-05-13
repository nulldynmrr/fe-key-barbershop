import axios from "axios";
import Cookies from "js-cookie";

const ADMIN_ROUTES = [
  "/dashboard",
  "/ai-config",
  "/langganan",
  "/barbers",
  "/transaksi",
  "/media-social",
  "/feedbacks",
];

const isAdminRoute = (path) => ADMIN_ROUTES.some((r) => path.startsWith(r));

const getToken = () => {
  if (typeof window === "undefined") return null;
  const path = window.location.pathname;
  if (isAdminRoute(path)) return Cookies.get("admin_token") ?? null;
  return Cookies.get("user_token") ?? null;
};

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 180000, // 3 menit
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

request.interceptors.response.use(
  (response) => response,
  (error) => {
    const skipAuthRedirect = error.config?.skipAuthRedirect;

    if (
      error.response?.status === 401 &&
      !skipAuthRedirect &&
      typeof window !== "undefined"
    ) {
      const path = window.location.pathname;

      if (isAdminRoute(path)) {
        Cookies.remove("admin_token");
        localStorage.removeItem("admin");
        window.location.href = "/login-admin";
      } else {
        Cookies.remove("user_token");
        localStorage.removeItem("user");
        const isAuthPage =
          path.startsWith("/login") || path.startsWith("/login-admin");
        if (!isAuthPage) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  },
);

export const saveAdminAuth = (token, user) => {
  Cookies.set("admin_token", token, { expires: 1 });
  localStorage.setItem("admin", JSON.stringify(user));
};

export const saveUserAuth = (token, user) => {
  Cookies.set("user_token", token, { expires: 7 });
  localStorage.setItem("user", JSON.stringify(user));
};

export const logoutAdmin = () => {
  Cookies.remove("admin_token");
  localStorage.removeItem("admin");
  window.location.href = "/login-admin";
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/user/logout", {}, {}, true);
  } catch (e) {
    // ignore
  }
  Cookies.remove("user_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

const api = {
  get: (url, params = null, headers = {}, skipAuthRedirect = false) =>
    request({ method: "get", url, params, headers, skipAuthRedirect }),

  post: (url, data, headers = {}, skipAuthRedirect = false) =>
    request({ method: "post", url, data, headers, skipAuthRedirect }),

  put: (url, data, headers = {}) =>
    request({ method: "put", url, data, headers }),

  patch: (url, data, headers = {}) =>
    request({ method: "patch", url, data, headers }),

  delete: (url, data = null, headers = {}) => {
    const config = { method: "delete", url, headers };
    if (data) config.data = data;
    return request(config);
  },
};

export default api;
