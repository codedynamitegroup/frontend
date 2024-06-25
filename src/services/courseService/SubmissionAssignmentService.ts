import { AxiosInstance, AxiosResponse } from "axios";
import { API } from "constants/API";
import { CreateSubmissionAssignmentCommand } from "models/courseService/entity/create/CreateSubmissionAssignmentCommand";
import { UpdateSubmissionAssignment } from "models/courseService/entity/update/UpdateSubmissionAssignment";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class SubmissionAssignmentService {
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
  static async createSubmissionAssignment(data: CreateSubmissionAssignmentCommand) {
    try {
      const response = await this.apiClient.post(
        `${API.COURSE.SUBMISSION_ASSIGNMENT.DEFAULT}`,
        data
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  static async update(data: UpdateSubmissionAssignment, id: string) {
    try {
      const response = await this.apiClient.put(
        `${API.COURSE.SUBMISSION_ASSIGNMENT.UPDATE_BY_ID}`.replace(":id", id),
        data
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  static async getSubmissionAssignmentByUserIdAsignmentId(userId: string, assignmentId: string) {
    try {
      const response = await this.apiClient.get(
        `${API.COURSE.SUBMISSION_ASSIGNMENT.GET_BY_USER_ID_ASSIGNMENT_ID}`,
        {
          params: { userId, assignmentId }
        }
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  static async getSubmissionAssignmentById(submissionAssignmentId: string) {
    try {
      const response = await this.apiClient.get(
        `${API.COURSE.SUBMISSION_ASSIGNMENT.GET_BY_ID}`.replace(":id", submissionAssignmentId)
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  static async getSubmissionAssignmentByAssignmentId(assignmentId: string) {
    try {
      const response = await this.apiClient.get(`${API.COURSE.SUBMISSION_ASSIGNMENT.DEFAULT}`, {
        params: { assignmentId }
      });
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  static async countSubmissionToGrade(assignmentId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.SUBMISSION_ASSIGNMENT.COUNT_TO_GRADE}`, {
        params: { assignmentId }
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch submission assignment by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async countAllSubmission(assignmentId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.SUBMISSION_ASSIGNMENT.COUNT_ALL}`, {
        params: { assignmentId }
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch submission assignment by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
