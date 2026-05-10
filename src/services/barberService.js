import api from "@/utils/request";

export const barberService = {
  getBarbers: () => api.get("/barbers"),
  createBarber: (formData) => api.post("/barbers", formData, {
    "Content-Type": "multipart/form-data"
  }),
  updateBarber: (id, formData) => api.put(`/barbers/${id}`, formData, {
    "Content-Type": "multipart/form-data"
  }),
  deleteBarber: (id) => api.delete(`/barbers/${id}`)
};
