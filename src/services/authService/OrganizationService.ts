import { API } from "constants/API";
import {
  CreateOrganizationRequest,
  UpdateOrganizationBySystemAdminRequest
} from "models/authService/entity/organization";
import api from "utils/api";

const authServiceApiUrl = process.env.REACT_APP_AUTH_SERVICE_API_URL || "";

export class OrganizationService {
  static async getAllOrganizations({
    searchName,
    pageNo = 0,
    pageSize = 10
  }: {
    searchName?: string;
    pageNo?: number;
    pageSize?: number;
  }) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).get(`${API.AUTH.ORGANIZATION.GET_ALL_ORGANIZATIONS}`, {
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
  static async getOrganizationById(id: string) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).get(`${API.AUTH.ORGANIZATION.GET_ORGANIZATION_BY_ID.replace(":id", id)}`);
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
  static async createOrganization(createOrganizationRequest: CreateOrganizationRequest) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).post(`${API.AUTH.ORGANIZATION.CREATE_ORGANIZATION}`, createOrganizationRequest);
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
  static async updateOrganizationBySystemAdmin(
    id: string,
    updateOrganizationRequest: UpdateOrganizationBySystemAdminRequest
  ) {
    try {
      const response = await api({
        baseURL: authServiceApiUrl,
        isAuthorization: true
      }).put(
        `${API.AUTH.ORGANIZATION.UPDATE_ORGANIZATION_BY_ID.replace(":id", id)}`,
        updateOrganizationRequest
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
}
