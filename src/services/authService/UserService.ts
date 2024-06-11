import { API } from "constants/API";
import {
  LoginRequest,
  RegisteredRequest,
  ResetPasswordUserRequest,
  UpdatePasswordUserRequest,
  UpdateProfileUserRequest,
  VerifyOTPUserRequest
} from "models/authService/entity/user";
import { ESocialLoginProvider } from "models/authService/enum/ESocialLoginProvider";
import api from "utils/api";

const authServiceApiUrl = process.env.REACT_APP_AUTH_SERVICE_API_URL || "";

export class UserService {
  static async singleSignOn(accessToken: string, provider: ESocialLoginProvider) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl
      }).post(`${API.AUTH.SOCIAL_LOGIN}`, {
        provider: provider,
        accessToken: accessToken
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async getUserByEmail() {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).get(`${API.AUTH.GET_USER_BY_EMAIL}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
  static async login(loginData: LoginRequest) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl
      }).post(`${API.AUTH.LOGIN}`, loginData);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async refreshToken(accessToken: string, refreshToken: string) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl
      }).post(`${API.AUTH.REFRESH_TOKEN}`, {
        accessToken: accessToken,
        refreshToken: refreshToken
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
  static async logout() {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).post(`${API.AUTH.LOGOUT}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }

  static async register(registeredData: RegisteredRequest) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl
      }).post(`${API.AUTH.REGISTER}`, registeredData);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async updateProfileUser(updateProfileUserRequest: UpdateProfileUserRequest) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).put(`${API.AUTH.UPDATE_PROFILE_USER}`, {
        firstName: updateProfileUserRequest.firstName,
        lastName: updateProfileUserRequest.lastName,
        dob: updateProfileUserRequest.dob,
        phone: updateProfileUserRequest.phone
      });
      if (response?.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error?.code || 503,
        status: error?.status || "Service Unavailable",
        message: error?.message
      });
    }
  }
  static async updatePasswordUser(updatePasswordUserRequest: UpdatePasswordUserRequest) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).post(`${API.AUTH.CHANGE_PASSWORD}`, {
        oldPassword: updatePasswordUserRequest.oldPassword,
        newPassword: updatePasswordUserRequest.newPassword
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
  static async forgotPassword(email: string, redirectUrl: string) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl
      }).put(`${API.AUTH.FORGOT_PASSWORD}`, {
        email: email,
        redirectUrl: redirectUrl
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
  static async verifyOTP(verifyOTP: VerifyOTPUserRequest) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl
      }).post(`${API.AUTH.VERIFY_OTP}`, {
        email: verifyOTP.email,
        otp: verifyOTP.otp
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
  static async resetPassword(resetPasswordUserRequest: ResetPasswordUserRequest) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl
      }).post(`${API.AUTH.RESET_PASSWORD}`, {
        email: resetPasswordUserRequest.email,
        newPassword: resetPasswordUserRequest.password,
        otp: resetPasswordUserRequest.otp
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }

  static async getAllUser() {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).get(`${API.AUTH.GET_ALL}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }

  static async getUserStatistics() {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).get(`${API.AUTH.GET_STATISTICS}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
}
