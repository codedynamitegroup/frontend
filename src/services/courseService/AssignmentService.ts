import { AxiosInstance, AxiosResponse } from "axios";
import { API } from "constants/API";
import api from "utils/api";

import { CreateAssignmentCommand } from "models/courseService/entity/create/CreateAssignmentCommand";
import { CreateIntroAttachmentCommand } from "models/courseService/entity/create/CreateIntroAttachmentCommand";
import { UpdateAssignmentCommand } from "models/courseService/entity/update/UpdateAssignmentCommand";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class AssignmentService {
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

  static async getAssignmentsByCourseId(courseId: string) {
    try {
      const response = await this.apiClient.get(`${API.COURSE.ASSIGNMENT.DEFAULT}`, {
        params: { courseId }
      });
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async getAssignmentById(id: string) {
    try {
      const response = await this.apiClient.get(
        `${API.COURSE.ASSIGNMENT.GET_BY_ID.replace(":id", id)}`
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async getListSubmissionByAssignmentId(id: string) {
    try {
      const response = await this.apiClient.get(
        `${API.COURSE.ASSIGNMENT.LIST_SUBMISSION.replace(":id", id)}`
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async createAssignment(assignment: CreateAssignmentCommand) {
    try {
      const response = await this.apiClient.post(API.COURSE.ASSIGNMENT.CREATE, assignment);
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async updateAssignment(assignment: UpdateAssignmentCommand, assignmentId: string) {
    try {
      const response = await this.apiClient.put(
        API.COURSE.ASSIGNMENT.UPDATE_BY_ID.replace(":id", assignmentId),
        assignment
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async deleteAssignment(id: string) {
    try {
      const response = await this.apiClient.delete(
        API.COURSE.ASSIGNMENT.DELETE_BY_ID.replace(":id", id)
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async createIntroAttachment(introAttachment: CreateIntroAttachmentCommand) {
    try {
      const response = await this.apiClient.post(
        API.COURSE.ASSIGNMENT.INTRO_ATTACHMENT,
        introAttachment
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async updateIntroAttachment(
    introAttachment: CreateIntroAttachmentCommand,
    assignmentId: string
  ) {
    try {
      const response = await this.apiClient.put(
        `${API.COURSE.ASSIGNMENT.INTRO_ATTACHMENT}/${assignmentId}`,
        introAttachment
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  static async deleteIntroAttachment(id: string) {
    try {
      const response = await this.apiClient.delete(
        `${API.COURSE.ASSIGNMENT.INTRO_ATTACHMENT}/${id}`
      );
      return this.handleResponse(response);
    } catch (error: any) {
      return this.handleError(error);
    }
  }
  static async getAssignmentGradeByStudent(courseId: string, userId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.ASSIGNMENT.GET_ASSIGNMENT_GRADE_BY_STUDENT}`, {
        params: {
          courseId,
          userId
        }
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch assignment grade by student", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
