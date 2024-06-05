import axios from "axios";
import { API } from "constants/API";
const AUTH_SERVICE_API_URL = process.env.REACT_APP_AUTH_SERVICE_API_URL || "";

const createInstance = ({
  baseURL,
  isAuthorization = false
}: {
  baseURL: string;
  isAuthorization?: boolean;
}) => {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (isAuthorization === true) {
    instance.interceptors.request.use(
      (config) => {
        const newAccessToken = localStorage.getItem("access_token");
        if (newAccessToken) {
          config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          config.headers["Access-Token"] = newAccessToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const originalRequest = error.config;
        // Handle 401 Unauthorized
        if (
          error.response &&
          error.response.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;
          return axios
            .post(`${AUTH_SERVICE_API_URL}${API.AUTH.REFRESH_TOKEN}`, {
              accessToken,
              refreshToken
            })
            .then((res) => {
              if (res.status === 200) {
                localStorage.setItem("access_token", res.data.accessToken);
                localStorage.setItem("refresh_token", res.data.refreshToken);
                return instance(originalRequest);
              }
            })
            .catch((err: any) => {
              // if status Please authenticate
              if (err?.code === 401 || err?.code === 403) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("provider");
              }
            });
        }
        return Promise.reject({
          code: error?.response?.data?.code || error?.response?.status || 503,
          status:
            error?.response?.status === 401 || error?.response?.status === 403
              ? "Unauthorized"
              : error.response?.data?.status || "Service Unavailable",
          message:
            error?.response?.status === 401 || error?.response?.status === 403
              ? "Please authenticate"
              : error?.response?.data?.message || error?.message
        });
      }
    );
  }
  return instance;
};

export default createInstance;
