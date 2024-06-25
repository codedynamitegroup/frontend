import { AxiosInstance, AxiosResponse } from "axios";
import { API } from "constants/API";
import { CreateSubmissionAssignmentFile } from "models/courseService/entity/create/CreateSubmissionAssignmentFile";
import { UpdateSubmissionAssignmentFile } from "models/courseService/entity/update/UpdateSubmissionAssignmentFile";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class SubmissionAssignmentFileService {
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
  static async create(data: CreateSubmissionAssignmentFile) {
    try {
      const response = await this.apiClient.post(
        `${API.COURSE.SUBMISSION_ASSIGNMENT_FILE.DEFAULT}`,
        data
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  static async update(data: CreateSubmissionAssignmentFile, id: string) {
    try {
      const response = await this.apiClient.put(
        `${API.COURSE.SUBMISSION_ASSIGNMENT_FILE.DEFAULT}/${id}`,
        data
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  static async deleteById(id: string) {
    try {
      const response = await this.apiClient.delete(
        `${API.COURSE.SUBMISSION_ASSIGNMENT_FILE.DELETE_BY_ID}`.replace(":id", id)
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
}
