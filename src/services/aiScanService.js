import api from "@/utils/request";

export const aiScanService = {
  guestLogin: (data) => api.post("/auth/guest-login", data, {}, true),
  getFeatures: () => api.get("/ai/features"),
  analyzeFace: (formData) =>
    api.post("/ai/analyze-face", formData, {
      "Content-Type": "multipart/form-data",
    }),
};
