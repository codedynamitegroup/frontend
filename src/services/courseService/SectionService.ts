import { API } from "constants/API";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class SectionService {
  static async getSectionsByCourseId(courseId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.SECTION.GET_ALL_BY_COURSE_ID.replace(":courseId", courseId)}`);
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
  static async updateSection(sectionId: string, sectionName: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).put(`${API.COURSE.SECTION.UPDATE.replace(":sectionId", sectionId)}`, {
        name: sectionName
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create exam", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
