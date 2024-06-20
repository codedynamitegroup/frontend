import axios, { AxiosInstance, AxiosResponse } from "axios";
import { API } from "constants/API";
import { CreateSubmissionGradeCommand } from "models/courseService/entity/create/CreateSubmissionGradeCommand";
import { UpdateSubmissionGradeCommand } from "models/courseService/entity/update/UpdateSubmissionGradeCommand";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class SubmissionGradeService {
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

  static async createSubmissionGrade(createSubmissionGradeCommand: CreateSubmissionGradeCommand) {
    try {
      const response = await this.apiClient.post(
        `${API.COURSE.SUBMISSION_GRADE.DEFAULT}`,
        createSubmissionGradeCommand
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async updateSubmissionGrade(
    updateSubmissionGrade: UpdateSubmissionGradeCommand,
    id: string
  ) {
    try {
      const response = await this.apiClient.put(
        `${API.COURSE.SUBMISSION_GRADE.DEFAULT}/${id}`,
        updateSubmissionGrade
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
}
