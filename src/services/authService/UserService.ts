import axios from "axios";
import { API } from "constants/API";
import { LoginRequest, RegisteredRequest } from "models/authService/entity/user";
import { ESocialLoginProvider } from "models/authService/enum/ESocialLoginProvider";
import api from "utils/api";

const authServiceApiUrl = process.env.REACT_APP_AUTH_SERVICE_API_URL || "";

export class UserService {
  static async singleSignOn(accessToken: string, provider: ESocialLoginProvider) {
    try {
      const response = await axios.post(`${authServiceApiUrl}${API.AUTH.SOCIAL_LOGIN}`, {
        provider: provider,
        accessToken: accessToken
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to single sign on", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async getUserByEmail(email: string, accessToken: string) {
    try {
      const response = await axios.get(
        `${authServiceApiUrl}${API.AUTH.GET_USER_BY_EMAIL.replace(":email", email)}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to get user by email", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async login(loginData: LoginRequest) {
    try {
      const response = await axios.post(`${authServiceApiUrl}${API.AUTH.LOGIN}`, loginData);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to login", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async refreshToken(accessToken: string, refreshToken: string) {
    try {
      const response = await axios.post(`${authServiceApiUrl}${API.AUTH.REFRESH_TOKEN}`, {
        accessToken: accessToken,
        refreshToken: refreshToken
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to login", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async logout() {
    try {
      const response = await await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).post(`${authServiceApiUrl}${API.AUTH.LOGOUT}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to login", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async register(registeredData: RegisteredRequest) {
    try {
      const response = await axios.post(`${authServiceApiUrl}${API.AUTH.REGISTER}`, registeredData);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to register", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
