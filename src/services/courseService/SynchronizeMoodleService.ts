import { AxiosInstance, AxiosResponse } from "axios";
import { API } from "constants/API";
import { QuerySynchronizeStateCommand } from "models/courseService/entity/query/QuerySynchronizeStateCommand";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class SynchronizeMoodleService {
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

  static async synchronizeMoodle(id: string, userId: string) {
    try {
      const response = await this.apiClient.get(
        `${API.COURSE.SYNCHRONIZE_MOODLE.SYNCHRONIZE_MOODLE}`.replace(":id", id),
        {
          params: { userId }
        }
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async getByOrganizationIdAndStep(data: QuerySynchronizeStateCommand) {
    try {
      const response = await this.apiClient.get(
        `${API.COURSE.SYNCHRONIZE_MOODLE.GET_BY_ORGANIZATION_ID_AND_STEP}`,
        { params: data }
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async getByOrganizationId(organizationId: string) {
    try {
      const response = await this.apiClient.get(
        `${API.COURSE.SYNCHRONIZE_MOODLE.GET_ALL}`.replace(":id", organizationId)
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
}
