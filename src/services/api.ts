import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const registerUser = async (data: { name: string; email: string; password: string, role: string }) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, data);
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(`${API_URL}/api/auth/logout`);
  return response.data;
};