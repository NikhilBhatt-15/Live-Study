import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data) => {
  return await api.post("/users/login", data);
};

export async function signup({ email, password, name, avatar }) {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);
  formData.append("name", name);
  if (avatar) formData.append("avatar", avatar);

  const response = await api.post("/users/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export const logout = async () => {
  return await api.post("/users/logout");
};

export const refreshAccessToken = async () => {
  return await api.post("/users/refresh-token");
};

export const getCurrentUser = async () => {
  return await api.get("/users/me");
};

export const golive = async (data) => {
  return await api.post("/users/live", data);
};

export const getLiveStreams = async () => {
  return await api.get("/users/live");
};
export const getLiveStreamById = async (id) => {
  return await api.get(`/users/live/${id}`);
};

export const getVideos = async () => {
  return await api.get("/videos");
};

export const getVideoById = async (id) => {
  return await api.get(`/videos/${id}`);
};

export const getChannelInfo = async (id) => {
  return await api.get(`channels/info/${id}`);
};
export const isSubscribed = async (id) => {
  return await api.get(`channels/isSubscribed/${id}`);
};
export const getChannelVideos = async (id) => {
  return await api.get(`channels/videos/${id}`);
};
export const subscribeToChannel = async (id) => {
  return await api.post(`/channels/subscribe/${id}`);
};
export const unsubscribeFromChannel = async (id) => {
  return await api.post(`/channels/unsubscribe/${id}`);
};
export const getOwnChannelProfile = async () => {
  return await api.get("/channels/profile");
};

export const likeVideo = async (id) => {
  return await api.post(`/videos/like/${id}`);
};

export const dislikeVideo = async (id) => {
  return await api.post(`/videos/dislike/${id}`);
};

export const isVideoLiked = async (id) => {
  return await api.get(`/videos/isLiked/${id}`);
};
