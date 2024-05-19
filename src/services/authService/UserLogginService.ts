import axios from "axios";
import { API } from "constants/API";
import { ESocialLoginProvider } from "models/authService/enum/ESocialLoginProvider";

const authServiceApiUrl = process.env.REACT_APP_AUTH_SERVICE_API_URL || "";

export class UserLogginService {
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
}
