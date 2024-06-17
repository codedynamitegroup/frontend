import axios from "axios";
import { API } from "constants/API";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class SubmissionAssignmentFileService {
  static async create(data: any) {
    try {
      const response = await axios.post(
        `${courseServiceApiUrl}${API.COURSE.SUBMISSION_ASSIGNMENT_FILE.CREATE}`,
        data
      );

      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create submission assignment file", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async update(data: any, id: string) {
    try {
      const response = await axios.put(
        `${courseServiceApiUrl}${API.COURSE.SUBMISSION_ASSIGNMENT_FILE.UPDATE_BY_ID}`.replace(
          ":id",
          id
        ),
        data
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to update submission assignment file", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async deleteById(id: string) {
    try {
      const response = await axios.delete(
        `${courseServiceApiUrl}${API.COURSE.SUBMISSION_ASSIGNMENT_FILE.DELETE_BY_ID}`.replace(
          ":id",
          id
        )
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to delete submission assignment file", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
