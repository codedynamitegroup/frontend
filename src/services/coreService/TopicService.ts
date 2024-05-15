import axios from "axios";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class TopicService {
  // Role: Anonymous
  static async getTopics() {
    try {
      const response = await axios.get(`${coreServiceApiUrl}topics`);
      if (response.status === 200) {
        Promise.resolve(response.data);
      } else {
        console.error("Failed to fetch topics", response.data);
        Promise.reject({
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch topics", error.response?.data || error.message);
      Promise.reject({
        code: error.response?.status || 503,
        status: error.response?.statusText || "Service Unavailable",
        message: error.response?.data || error.message
      });
    }
  }

  // Role: User
  static async getTopicById(id: string) {
    try {
      const response = await axios.get(`${coreServiceApiUrl}topics/${id}`);
      if (response.status === 200) {
        Promise.resolve(response.data);
      } else {
        console.error("Failed to fetch topic", response.data);
        Promise.reject({
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error("Failed to fetch topic", error.response?.data || error.message);
      Promise.reject({
        code: error.response?.status || 503,
        status: error.response?.statusText || "Service Unavailable",
        message: error.response?.data || error.message
      });
    }
  }

  // Role: Admin
  static async updateTopicById(id: string, data: any) {
    try {
      const response = await axios.put(`${coreServiceApiUrl}topics/${id}`, data);
      if (response.status === 200) {
        Promise.resolve(response.data);
      } else {
        console.error("Failed to update topic", response.data);
        Promise.reject({
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error("Failed to update topic", error.response?.data || error.message);
      Promise.reject({
        code: error.response?.status || 503,
        status: error.response?.statusText || "Service Unavailable",
        message: error.response?.data || error.message
      });
    }
  }

  // Role: Admin
  static async deleteTopicById(id: string) {
    try {
      const response = await axios.delete(`${coreServiceApiUrl}topics/${id}`);
      if (response.status === 200) {
        Promise.resolve(response.data);
      } else {
        console.error("Failed to delete topic", response.data);
        Promise.reject({
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      console.error("Failed to delete topic", error.response?.data || error.message);
      Promise.reject({
        code: error.response?.status || 503,
        status: error.response?.statusText || "Service Unavailable",
        message: error.response?.data || error.message
      });
    }
  }
}
