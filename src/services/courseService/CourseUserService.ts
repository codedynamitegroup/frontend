import { API } from "constants/API";
import { AssignUsersToCourseCommand } from "models/courseService/entity/custom/AssignUsersToCourseCommand";
import { UnassignUsersToCourseCommand } from "models/courseService/entity/custom/UnassignUsersToCourseCommand";
import qs from "qs";
import api from "utils/api";

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
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.COURSE_USER.GET_USER_BY_COURSE_ID.replace(":id", courseId)}`, {
        params: {
          search,
          pageNo,
          pageSize
        }
      });
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
  static async getAllUsersAbleToAssignToCourse({
    search = "",
    pageNo = 0,
    pageSize = 10,
    courseId,
    organizationId
  }: {
    search?: string;
    pageNo?: number;
    pageSize?: number;
    courseId: string;
    organizationId: string;
  }) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.COURSE_USER.GET_ALL_USERS_ABLE_TO_ASSIGN_TO_COURSE}`, {
        params: {
          search,
          pageNo,
          pageSize,
          courseId,
          organizationId
        }
      });
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
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.COURSE_USER.COUNT_STUDENT_BY_COURSE_ID.replace(":id", courseId)}`);
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
  static async getAllCourseByUserId(
    userId: string,
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
      }).get(`${API.COURSE.COURSE_USER.GET_ALL_COURSE_BY_USER_ID.replace(":id", userId)}`, {
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
      console.error("Failed to fetch course user", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async assignUsersToCourse(assignUsersToCourseCommand: AssignUsersToCourseCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.COURSE_USER.ASSIGN_USERS_TO_COURSE}`, assignUsersToCourseCommand);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to submit exam", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async unassignUsersToCourse(unassignUsersToCourseCommand: UnassignUsersToCourseCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).patch(`${API.COURSE.COURSE_USER.UNASSIGN_USERS_TO_COURSE}`, unassignUsersToCourseCommand);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to submit exam", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
