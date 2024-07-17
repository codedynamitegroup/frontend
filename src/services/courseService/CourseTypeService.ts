import { API } from "constants/API";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class CourseTypeService {
  static async getCourseTypes() {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.COURSE_TYPE.DEFAULT}`, {});
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch course types", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getCourseTypeByOrganizationId(
    id: string,
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
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.COURSE_TYPE.GET_BY_ORGANIZATION_ID}`.replace(":organizationId", id), {
        params: {
          searchName: search,
          pageNo,
          pageSize
        }
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch course type by organization id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
