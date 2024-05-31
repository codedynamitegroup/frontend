import { UpdateCertificateCourseCommand } from "./../../models/coreService/update/UpdateCertificateCourseCommand";
import { API } from "constants/API";
import { CreateCertificateCourseCommand } from "models/coreService/create/CreateCertificateCourseCommand";
import { IsRegisteredFilterEnum } from "models/coreService/enum/IsRegisteredFilterEnum";
import api from "utils/api";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class CertificateCourseService {
  static async getCertificateCourses({
    courseName = "",
    filterTopicIds = [],
    isRegisteredFilter = IsRegisteredFilterEnum.ALL
  }: {
    courseName: string;
    filterTopicIds: string[];
    isRegisteredFilter: IsRegisteredFilterEnum;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).post(`${API.CORE.CERTIFICATE_COURSE.DEFAULT}`, {
        courseName: courseName,
        filterTopicIds: filterTopicIds,
        isRegisteredFilter: isRegisteredFilter
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

  static async getCertificateCourseById(id: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).get(`${API.CORE.CERTIFICATE_COURSE.GET_BY_ID.replace(":id", id)}`);
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

  static async createCertificateCourse(data: CreateCertificateCourseCommand) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.CERTIFICATE_COURSE.DEFAULT}`, data);
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

  static async registerCertificateCourseById(id: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.CERTIFICATE_COURSE.REGISTER_BY_ID.replace(":id", id)}`, {
        userId: "9ba179ed-d26d-4828-a0f6-8836c2063992"
      });
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

  static async updateCertificateCourseById(id: string, data: UpdateCertificateCourseCommand) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).put(`${API.CORE.CERTIFICATE_COURSE.GET_BY_ID.replace(":id", id)}`, data);
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

  static async deleteCertificateCourseById(id: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).delete(`${API.CORE.CERTIFICATE_COURSE.DELETE_BY_ID.replace(":id", id)}`);
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
