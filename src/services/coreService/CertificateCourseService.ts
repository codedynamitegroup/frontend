import axios from "axios";
import { API } from "constants/API";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class CertificateCourseService {
  // Role: Anonymous
  static async getCertificateCourses(data: { courseName: string; filterTopicIds: string[] }) {
    try {
      const response = await axios.post(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.DEFAULT}`,
        {
          courseName: data.courseName,
          filterTopicIds: data.filterTopicIds
        }
      );
      if (response.status === 200) {
        Promise.resolve(response.data);
      } else {
        console.error("Failed to fetch certificate courses", response.data);
        Promise.reject({
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch certificate courses", error.response?.data || error.message);
      Promise.reject({
        code: error.response?.status || 503,
        status: error.response?.statusText || "Service Unavailable",
        message: error.response?.data || error.message
      });
    }
  }

  // Role: User
  static async getCertificateCoursesByIsRegistered(data: {
    courseName: string;
    filterTopicIds: string[];
    isRegistered: boolean;
  }) {
    try {
      const response = await axios.post(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.GET_BY_IS_REGISTERED}`,
        {
          courseName: data.courseName,
          filterTopicIds: data.filterTopicIds,
          isRegistered: data.isRegistered
        }
      );
      if (response.status === 200) {
        Promise.resolve(response.data);
      } else {
        console.error("Failed to fetch certificate courses", response.data);
        Promise.reject({
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch certificate courses", error.response?.data || error.message);
      Promise.reject({
        code: error.response?.status || 503,
        status: error.response?.statusText || "Service Unavailable",
        message: error.response?.data || error.message
      });
    }
  }

  // Role: User
  static async getCertificateCourseById(id: string) {
    try {
      const response = await axios.get(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.GET_BY_ID.replace(":id", id)}`
      );
      if (response.status === 200) {
        Promise.resolve(response.data);
      } else {
        console.error("Failed to fetch certificate course", response.data);
        Promise.reject({
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch certificate course", error.response?.data || error.message);
      Promise.reject({
        code: error.response?.status || 503,
        status: error.response?.statusText || "Service Unavailable",
        message: error.response?.data || error.message
      });
    }
  }

  // Role: Teacher
  static async updateCertificateCourseById(id: string, data: any) {
    try {
      const response = await axios.put(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.UPDATE_BY_ID.replace(":id", id)}`,
        data
      );
      if (response.status === 200) {
        Promise.resolve(response.data);
      } else {
        console.error("Failed to update certificate course", response.data);
        Promise.reject({
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error("Failed to update certificate course", error.response?.data || error.message);
      Promise.reject({
        code: error.response?.status || 503,
        status: error.response?.statusText || "Service Unavailable",
        message: error.response?.data || error.message
      });
    }
  }

  // Role: Organization
  static async deleteCertificateCourseById(id: string) {
    try {
      const response = await axios.delete(
        `${coreServiceApiUrl}${API.CORE.CERTIFICATE_COURSE.DELETE_BY_ID.replace(":id", id)}`
      );
      if (response.status === 200) {
        Promise.resolve(response.data);
      } else {
        console.error("Failed to delete certificate course", response.data);
        Promise.reject({
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error("Failed to delete certificate course", error.response?.data || error.message);
      Promise.reject({
        code: error.response?.status || 503,
        status: error.response?.statusText || "Service Unavailable",
        message: error.response?.data || error.message
      });
    }
  }
}
