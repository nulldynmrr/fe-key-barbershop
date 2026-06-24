import api from "@/utils/request";

export const userManagementService = {
  getUsers: (params) => api.get("/admin/users", params),
  getUserDetail: (id) => api.get(`/admin/users/${id}`),
  topupPackage: (id, packageId) => api.post(`/admin/users/${id}/topup-package`, { packageId }),
  setActivePackage: (id, packageId) => api.patch(`/admin/users/${id}/active-package`, { packageId }),
  adjustCredit: (id, amount, reason) => api.patch(`/admin/users/${id}/credit`, { amount, reason }),
  updateStatus: (id, is_banned) => api.patch(`/admin/users/${id}/status`, { is_banned }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};
