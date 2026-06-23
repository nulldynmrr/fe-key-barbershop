import api from "@/utils/request";

export const userService = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  getAiHistory: (params) => api.get("/users/ai-history", params),
  getTransactions: (params) => api.get("/users/transactions", params),
  switchPackage: (packageId) => api.post("/users/switch-package", { package_id: packageId }),
};
