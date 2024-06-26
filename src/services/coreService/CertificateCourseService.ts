import { UpdateCertificateCourseCommand } from "./../../models/coreService/update/UpdateCertificateCourseCommand";
import { API } from "constants/API";
import {
  CreateCertificateCourseCommand,
  CreateCertificateCourseWithAllAttributeCommand
} from "models/coreService/create/CreateCertificateCourseCommand";
import { IsRegisteredFilterEnum } from "models/coreService/enum/IsRegisteredFilterEnum";
import api from "utils/api";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class CertificateCourseService {
  static async getCertificateCourses({
    courseName = "",
    filterTopicId,
    isRegisteredFilter = IsRegisteredFilterEnum.ALL
  }: {
    courseName: string;
    filterTopicId?: string;
    isRegisteredFilter: IsRegisteredFilterEnum;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).post(`${API.CORE.CERTIFICATE_COURSE.DEFAULT}`, {
        courseName,
        filterTopicId,
        isRegisteredFilter
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

  static async getMostEnrolledCertificateCourses() {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).post(`${API.CORE.CERTIFICATE_COURSE.MOST_ENROLLED}`);
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

  static async getMyCertificateCourses(courseName: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.CERTIFICATE_COURSE.MY_COURSES}`, {
        courseName,
        filterTopicId: null,
        isRegisteredFilter: IsRegisteredFilterEnum.REGISTERED
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

  static async getMyCompletedCertificateCourses(pageNo = 0, pageSize = 10) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.CERTIFICATE_COURSE.MY_COMPLETED_CERTIFICATIONS}`, {
        params: {
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
      }).post(`${API.CORE.CERTIFICATE_COURSE.REGISTER_BY_ID.replace(":id", id)}`);
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

  static async getCertificateCourseStatistics() {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).get(`${API.CORE.CERTIFICATE_COURSE.GET_STATISTICS}`);

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

  static async getAllCertificateCourses({
    searchName,
    pageNo = 0,
    pageSize = 10
  }: {
    searchName?: string;
    pageNo?: number;
    pageSize?: number;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).get(`${API.CORE.CERTIFICATE_COURSE.GET_ALL_WITH_PAGE}`, {
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

  static async createCertificateCourses(data: CreateCertificateCourseWithAllAttributeCommand) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.CERTIFICATE_COURSE.CREATE_FULL}`, data);
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
}
