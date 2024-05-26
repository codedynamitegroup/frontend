import axios from "axios";
import { API } from "constants/API";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class AssignmentService {
  static async getAssignmentsByCourseId(courseId: string) {
    try {
      const response = await axios.get(`${courseServiceApiUrl}${API.COURSE.ASSIGNMENT.DEFAULT}`, {
        params: { courseId }
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch assignments by course id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getAssignmentById(id: string) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.ASSIGNMENT.GET_BY_ID}`.replace(":id", id)
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch assignment by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
