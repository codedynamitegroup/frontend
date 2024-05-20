import axios from "axios";
import { API } from "constants/API";
import { IsRegisteredFilterEnum } from "models/coreService/enum/IsRegisteredFilterEnum";

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
      const response = await axios.post(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.DEFAULT}`,
        {
          courseName: courseName,
          filterTopicIds: filterTopicIds,
          isRegisteredFilter: isRegisteredFilter
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch certificate courses", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getCertificateCourseById(id: string) {
    try {
      const response = await axios.get(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.GET_BY_ID.replace(":id", id)}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch certificate course by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async createCertificateCourse(data: any) {
    try {
      const response = await axios.get(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.DEFAULT}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create certificate course", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async registerCertificateCourseById(id: string) {
    try {
      const response = await axios.get(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.GET_BY_ID.replace(":id", id)}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to register certificate course", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async updateCertificateCourseById(id: string, data: any) {
    try {
      const response = await axios.get(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.GET_BY_ID.replace(":id", id)}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to update certificate course", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async deleteCertificateCourseById(id: string) {
    try {
      const response = await axios.delete(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.DELETE_BY_ID.replace(":id", id)}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to delete certificate course", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}