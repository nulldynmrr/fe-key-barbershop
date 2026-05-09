import api from "@/utils/request";

export const barberService = {
  getBarbers: () => api.get("/barbers"),
  createBarber: (formData) => api.post("/barbers", formData, {
    "Content-Type": "multipart/form-data"
  }),
};
