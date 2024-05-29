import axios from "axios";

const AUTH_SERVICE_API_URL = process.env.REACT_APP_AUTH_SERVICE_API_URL || "";

const createInstance = ({
  baseURL,
  isAuthorization = false
}: {
  baseURL: string;
  isAuthorization?: boolean;
}) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "Access-Token": accessToken
    }
  });

  if (isAuthorization === true) {
    instance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // if (error.response && error.response.status === 400) {
        //   console.error("error.response.data", error.response.data);
        //   return Promise.resolve(error.response.data);
        // }
        const originalRequest = error.config;
        console.log("refreshToken", refreshToken);

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
            .post(AUTH_SERVICE_API_URL + "auth/refresh-tokens", {
              accessToken,
              refreshToken
            })
            .then((res) => {
              if (res.status === 200) {
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);

                // return axios(originalRequest);
                return instance(originalRequest);
              }
            })
            .catch((err: any) => {
              // if status Please authenticate
              if (err.response.status === 401 || err.response.status === 403) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
              }
              return Promise.reject({
                code: err.response?.data?.code || 503,
                status: err.response?.data?.status || "Service Unavailable",
                message: err.response?.data?.message || err.message
              });
            });
        }

        return Promise.reject({
          code: error.response?.data?.code || 503,
          status: error.response?.data?.status || "Service Unavailable",
          message: error.response?.data?.message || error.message
        });
      }
    );
  }
  return instance;
};

export default createInstance;
