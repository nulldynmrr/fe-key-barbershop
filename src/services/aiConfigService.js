import api from "@/utils/request";

export const aiConfigService = {
  getExchangeSettings: () => api.get("/ai-config/exchange"),
  updateExchangeSettings: (data) => api.put("/ai-config/exchange", data),

  getModels: () => api.get("/ai-config/models"),
  createModel: (data) => api.post("/ai-config/models", data),
  updateModel: (id, data) => api.put(`/ai-config/models/${id}`, data),
  deleteModel: (id) => api.delete(`/ai-config/models/${id}`),
  toggleModelStatus: (id, isActive) => api.patch(`/ai-config/models/${id}/status`, { isActive }),
  testConnection: (data) => api.post("/ai-config/models/test-connection", data),

  getLogs: (page = 1, limit = 10) => api.get("/ai-config/logs", { page, limit }),

  getFeaturePricing: () => api.get("/ai-config/feature-pricing"),
  updateFeaturePricing: (id, data) => api.put(`/ai-config/feature-pricing/${id}`, data),
};
