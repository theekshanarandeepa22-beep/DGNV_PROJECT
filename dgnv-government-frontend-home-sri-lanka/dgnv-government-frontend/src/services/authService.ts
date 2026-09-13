import api from "../api/axios";

export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

export type ChangePasswordRequest = {
  email: string;
  oldPassword: string;
  newPassword: string;
};

export const changePassword = async (request: ChangePasswordRequest) => {
  const response = await api.put('/auth/change-password', request);
  return response.data;
};
