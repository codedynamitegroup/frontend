import axios from "axios";
import { API } from "constants/API";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class CourseUserService {
  static async getUserByCourseId(
    courseId: string,
    {
      search = "",
      pageNo = 0,
      pageSize = 10
    }: {
      search?: string;
      pageNo?: number;
      pageSize?: number;
    }
  ) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.COURSE.GET_USER_BY_COURSE_ID.replace(":id", courseId)}`,
        {
          params: {
            search,
            pageNo,
            pageSize
          }
        }
      );
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch course user", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async countStudentByCourseId(courseId: string) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.COURSE.COUNT_STUDENT_BY_COURSE_ID.replace(":id", courseId)}`
      );
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch course user", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
