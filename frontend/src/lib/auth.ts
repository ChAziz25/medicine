import api from "./axios";

export async function checkSession() {
  const response = await api.get("/user/checkSession");
  return response.data;
}
