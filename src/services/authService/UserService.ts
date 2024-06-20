import { API } from "constants/API";
import {
  AssignUserToOrganizationRequest,
  CreatedUserByAdminRequest,
  EBelongToOrg,
  LoginRequest,
  RegisteredRequest,
  ResetPasswordUserRequest,
  UpdatePasswordUserRequest,
  UpdateProfileUserRequest,
  UpdateUserByAdminRequest,
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
      }).post(`${API.AUTH.USER.SOCIAL_LOGIN}`, {
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
      }).get(`${API.AUTH.USER.GET_USER_BY_EMAIL}`);
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
  static async getUserById(id: string) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).get(`${API.AUTH.USER.GET_USER_BY_ID.replace(":id", id)}`);
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
  static async deleteUserById(id: string) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).delete(`${API.AUTH.USER.DELETE_USER_BY_ID.replace(":id", id)}`);
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
      }).post(`${API.AUTH.USER.LOGIN}`, loginData);
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
      }).post(`${API.AUTH.USER.REFRESH_TOKEN}`, {
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
      }).post(`${API.AUTH.USER.LOGOUT}`);
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
      }).post(`${API.AUTH.USER.REGISTER}`, registeredData);
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
  static async createUserByAdmin(createdUserByAdminRequest: CreatedUserByAdminRequest) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).post(`${API.AUTH.USER.CREATE_USER_BY_ADMIN}`, createdUserByAdminRequest);
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
  static async assignUserToOrganization(
    userId: string,
    assignUserToOrganizationRequest: AssignUserToOrganizationRequest
  ) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).put(
        `${API.AUTH.USER.ASSIGN_USER_TO_ORGANIZATION.replace(":id", userId)}`,
        assignUserToOrganizationRequest
      );
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
  static async unassignedUserToOrganization(userId: string) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).put(`${API.AUTH.USER.UNASSIGNED_USER_TO_ORGANIZATION.replace(":id", userId)}`);
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
  static async updateProfileUser(updateProfileUserRequest: UpdateProfileUserRequest) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).put(`${API.AUTH.USER.UPDATE_PROFILE_USER}`, {
        email: updateProfileUserRequest.email,
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
  static async updateUserByAdmin(
    userId: string,
    updateUserByAdminRequest: UpdateUserByAdminRequest
  ) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).put(
        `${API.AUTH.USER.UPDATE_USER_BY_ADMIN.replace(":id", userId)}`,
        updateUserByAdminRequest
      );
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
      }).post(`${API.AUTH.USER.CHANGE_PASSWORD}`, {
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
      }).put(`${API.AUTH.USER.FORGOT_PASSWORD}`, {
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
      }).post(`${API.AUTH.USER.VERIFY_OTP}`, {
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
      }).post(`${API.AUTH.USER.RESET_PASSWORD}`, {
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

  static async getAllUser({
    searchName,
    pageNo = 0,
    pageSize = 10,
    belongToOrg = EBelongToOrg.ALL
  }: {
    searchName?: string;
    pageNo?: number;
    pageSize?: number;
    belongToOrg?: string;
  }) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).get(`${API.AUTH.USER.GET_ALL_USERS}`, {
        params: {
          searchName,
          pageNo,
          pageSize,
          belongToOrg
        }
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

  static async getAllUserByOrganization({
    searchName,
    pageNo = 0,
    pageSize = 10,
    id
  }: {
    searchName?: string;
    pageNo?: number;
    pageSize?: number;
    id: string;
  }) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).get(`${API.AUTH.USER.GET_ALL_USERS_BY_ORGANIZATION.replace(":id", id)}`, {
        params: {
          searchName,
          pageNo,
          pageSize
        }
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

  static async getUserStatistics() {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).get(`${API.AUTH.USER.GET_STATISTICS}`);
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
