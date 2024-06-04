import axios from "axios";
import { API } from "constants/API";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class SubmissionAssignmentService {
  static async getSubmissionAssignmentById(userId: string, assignmentId: string) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.SUBMISSION_ASSIGNMENT.GET_BY_USER_ID_ASSIGNMENT_ID}`,
        {
          params: { userId, assignmentId }
        }
      );

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
  static async getSubmissionAssignmentByAssignmentId(assignmentId: string) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.SUBMISSION_ASSIGNMENT.DEFAULT}`,
        {
          params: { assignmentId }
        }
      );

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
  static async countSubmissionToGrade(assignmentId: string) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.SUBMISSION_ASSIGNMENT.COUNT_TO_GRADE}`,
        {
          params: { assignmentId }
        }
      );

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
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.SUBMISSION_ASSIGNMENT.COUNT_ALL}`,
        {
          params: { assignmentId }
        }
      );

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
