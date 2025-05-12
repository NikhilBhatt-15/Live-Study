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
