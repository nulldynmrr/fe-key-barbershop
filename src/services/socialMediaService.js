import api from "@/utils/request";

export const socialMediaService = {
  getSocialMedias: () => api.get("/social-media"),
  createSocialMedia: (data) => api.post("/social-media", data, {
    "Content-Type": "multipart/form-data"
  }),


  deleteSocialMedia: (id) => api.delete(`/social-media/${id}`),
};
