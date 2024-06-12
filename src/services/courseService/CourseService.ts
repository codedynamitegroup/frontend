import axios from "axios";
import { API } from "constants/API";
import qs from "qs";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class CourseService {
  static async getCourses({
    search = "",
    courseType = [],
    pageNo = 0,
    pageSize = 10
  }: {
    search?: string;
    courseType?: string[];
    pageNo?: number;
    pageSize?: number;
  }) {
    try {
      const response = await axios.get(`${courseServiceApiUrl}${API.COURSE.COURSE.DEFAULT}`, {
        params: {
          search,
          courseType,
          pageNo,
          pageSize
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        }
      });
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch courses", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getSectionsByCourseId(courseId: string) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.COURSE.SECTION}/${courseId}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch sections by course id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getCourseStatistics() {
    try {
      const response = await axios.get(`${courseServiceApiUrl}${API.COURSE.COURSE.GET_STATISTICS}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch sections by course id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
