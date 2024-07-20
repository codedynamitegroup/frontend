import { API } from "constants/API";
import { CreateCourseCommand } from "models/courseService/entity/create/CreateCourseCommand";
import { CourseUpdateCommand } from "models/courseService/entity/update/UpdateCourseCommand";
import qs from "qs";
import api from "utils/api";

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
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.COURSE.DEFAULT}`, {
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

  static async getAllCoursesByOrganizationId(
    organizationId: string,
    {
      search = "",
      courseType = [],
      pageNo = 0,
      pageSize = 10
    }: {
      search?: string;
      courseType?: string[];
      pageNo?: number;
      pageSize?: number;
    }
  ) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(
        `${API.COURSE.COURSE.GET_ALL_COURSES_BY_ORGANIZATION_ID.replace(":organizationId", organizationId)}`,
        {
          params: {
            search,
            courseType,
            pageNo,
            pageSize
          },
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          }
        }
      );
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch courses by organization id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getCourseDetail(courseId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.COURSE.DEFAULT}/${courseId}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch course detail", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async deleteCourse(courseId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).delete(`${API.COURSE.COURSE.DELETE.replace(":courseId", courseId)}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch course detail", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async editCourse(courseId: string, courseUpdateCommand: CourseUpdateCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).put(`${API.COURSE.COURSE.UPDATE.replace(":courseId", courseId)}`, courseUpdateCommand);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to edit course", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async createCourse(createCourseCommand: CreateCourseCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.COURSE.CREATE}`, createCourseCommand);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create course", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async getCourseStatistics() {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.COURSE.GET_STATISTICS}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch course detail", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async getCourseStatisticsAdminOrg(orgId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.COURSE.GET_ORG_ADMIN_STATISTICS}`, {
        params: {
          orgId
        }
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch course detail", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
