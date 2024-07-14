import { AxiosInstance, AxiosResponse } from "axios";
import { API } from "constants/API";
import api from "utils/api";
import { UpdateOrganizationCommand } from "../../models/courseService/entity/update/UpdateOrganizationCommand";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class OrganizationService {
  private static apiClient: AxiosInstance = api({
    baseURL: courseServiceApiUrl,
    isAuthorization: true
  });

  private static async handleResponse<T>(response: AxiosResponse<T>): Promise<T> {
    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }
    throw new Error(`Unexpected response status: ${response.status}`);
  }

  private static handleError(error: any) {
    console.error("API call failed", error);
    return Promise.reject({
      code: error.response?.data?.code || 503,
      status: error.response?.data?.status || "Service Unavailable",
      message: error.response?.data?.message || error.message
    });
  }

  static async updateOrganization(id: string, data: UpdateOrganizationCommand) {
    try {
      const response = await this.apiClient.put(
        `${API.COURSE.ORGANIZATION.UPDATE_ORGANIZATION_BY_ID}`.replace(":id", id),
        data
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
}
