import { API } from "constants/API";
import api from "utils/api";
import { CreateCourseTypeCommand } from "./../../models/courseService/entity/create/CreateCourseTypeCommand";
import { UpdateCourseTypeCommand } from "models/courseService/entity/update/UpdateCourseTypeCommand";

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
  static async deleteCourseType(courseTypeId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).delete(`${API.COURSE.COURSE_TYPE.DELETE_BY_ID.replace(":id", courseTypeId)}`);
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
  static async editCourseType(
    courseTypeId: string,
    updateCourseTypeCommand: UpdateCourseTypeCommand
  ) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).put(
        `${API.COURSE.COURSE_TYPE.UPDATE_BY_ID.replace(":id", courseTypeId)}`,
        updateCourseTypeCommand
      );
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
  static async createCourseType(createCourseTypeCommand: CreateCourseTypeCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.COURSE_TYPE.CREATE}`, createCourseTypeCommand);
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
}
