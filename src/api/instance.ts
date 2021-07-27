import axios from "axios";
import config from "../config";

const instance = axios.create({ baseURL: config.backendUrl });

/**
    Add auth token to Authorization header if exists
 */
instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

/**
    Remove tokens from local storage if it has expired or is incorrect
 */
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response && 401 === error.response.status) {
      localStorage.setItem("email", "");
      localStorage.setItem("token", "");
      localStorage.setItem("refreshToken", "");
    } else {
      return Promise.reject(error);
    }
  }
);
export default instance;
