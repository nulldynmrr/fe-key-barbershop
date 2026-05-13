import api from "@/utils/request";

export const waitlistService = {
  getWaitlist: (page = 1, limit = 20) => {
    return api.get(`/waitlist?page=${page}&limit=${limit}`);
  },
  submitWaitlist: (data) => {
    return api.post("/waitlist", data);
  },
  markHandled: (id) => {
    return api.patch(`/waitlist/${id}/handle`);
  },
  deleteWaitlist: (id) => {
    return api.delete(`/waitlist/${id}`);
  }
};
