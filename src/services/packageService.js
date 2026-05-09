import api from "@/utils/request";

export const packageService = {
  getPackages: (page = 1, limit = 10) => api.get("/packages", { params: { page, limit } }),
  createPackage: (data) => api.post("/packages", data),
  updatePackage: (id, data) => api.put(`/packages/${id}`, data),
  deletePackage: (id) => api.delete(`/packages/${id}`),
  calculateHpp: (data) => api.post("/packages/calculate-hpp", data),
};
