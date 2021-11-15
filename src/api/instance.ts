import axios from "axios";

import config from "../config";

const instance = axios.create({ baseURL: config.backendUrl });

instance.interceptors.request.use(
  (axiosConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      // eslint-disable-next-line no-param-reassign
      axiosConfig.headers.Authorization = `Bearer ${token}`;
    }
    return axiosConfig;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.setItem("email", "");
      localStorage.setItem("token", "");
      localStorage.setItem("refreshToken", "");
      return Promise.resolve();
    }

    return Promise.reject(error);
  }
);
export default instance;
