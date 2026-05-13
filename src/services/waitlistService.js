import api from "@/utils/request";

export const waitlistService = {
  getWaitlist: async (page = 1, limit = 20) => {
    const res = await api.get(`/waitlist?page=${page}&limit=${limit}`);
    return res.data;
  },
  submitWaitlist: async (data) => {
    const res = await api.post("/waitlist", data);
    return res.data;
  },
  markHandled: async (id) => {
    const res = await api.patch(`/waitlist/${id}/handle`);
    return res.data;
  },
  deleteWaitlist: async (id) => {
    const res = await api.delete(`/waitlist/${id}`);
    return res.data;
  },
  checkStatus: async () => {
    const res = await api.get("/waitlist/status");
    return res.data;
  },
  getUnhandledCount: async () => {
    const res = await api.get("/waitlist/unhandled-count");
    return res.data;
  }
};
