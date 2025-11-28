import axios from "axios";

const TOKEN_KEY = "aiteg_token";

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  console.log(token);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  delete axios.defaults.headers.common["Authorization"];
};

export const setAxiosAuthHeaderFromStorage = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

export default {
  setToken,
  getToken,
  removeToken,
  setAxiosAuthHeaderFromStorage,
};
