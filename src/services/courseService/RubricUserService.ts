import { API } from "constants/API";
import {
  CreateOrganizationRequest,
  UpdateOrganizationBySystemAdminRequest
} from "models/authService/entity/organization";
import {
  CreateRubricUserCommand,
  UpdateRubricUserCommand
} from "models/courseService/entity/RubricUserEntity";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class RubricUserService {
  static async getAllOrganizationsByUserId({
    userId,
    searchName,
    pageNo = 0,
    pageSize = 10
  }: {
    userId: string;
    searchName?: string;
    pageNo?: number;
    pageSize?: number;
  }) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.RUBRIC_USER.GET_ALL_BY_USER_ID.replace(":id", userId)}`, {
        params: {
          searchName,
          pageNo,
          pageSize
        }
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
  static async createRubricUser(createRubricUserCommand: CreateRubricUserCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.RUBRIC_USER.CREATE}`, createRubricUserCommand);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
  static async updateRubricUser(updateRubricUserCommand: UpdateRubricUserCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).put(
        `${API.COURSE.RUBRIC_USER.UPDATE.replace(":id", updateRubricUserCommand.rubricUserId)}`,
        updateRubricUserCommand
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
  static async deleteRubricUser(id: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).delete(`${API.COURSE.RUBRIC_USER.DELETE.replace(":id", id)}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
}
