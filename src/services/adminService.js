import api from "@/utils/request";

export const getAdminProfile = async () => {
  const res = await api.get("/admin/profile");
  return res.data;
};

export const requestAdminOTP = async () => {
  const res = await api.post("/admin/request-otp");
  return res.data;
};

export const updateAdminProfile = async (data) => {
  const res = await api.put("/admin/profile", data);
  return res.data;
};

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const markNotificationRead = async (id) => {
  const res = await api.put(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async () => {
  const res = await api.put("/notifications/mark-all-read");
  return res.data;
};

export const resolveUserEmail = async (userId) => {
  const res = await api.get(`/user/${userId}/resolve-email`);
  return res.data;
};
