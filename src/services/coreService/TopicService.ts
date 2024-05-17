import axios from "axios";
import { API } from "constants/API";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class TopicService {
  static async getTopics({
    pageNo = 0,
    pageSize = 10,
    fetchAll
  }: {
    pageNo?: number;
    pageSize?: number;
    fetchAll: boolean;
  }) {
    try {
      const response = await axios.get(`${coreServiceApiUrl}${API.CORE.TOPIC.DEFAULT}`, {
        params: {
          pageNo,
          pageSize,
          fetchAll
        }
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch topics", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  // Role: User
  static async getTopicById(id: string) {
    try {
      const response = await axios.get(
        `${coreServiceApiUrl}${API.CORE.TOPIC.GET_BY_ID.replace(":id", id)}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch topic by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  // Role: Admin
  static async updateTopicById(id: string, data: any) {
    try {
      const response = await axios.get(
        `${coreServiceApiUrl}${API.CORE.TOPIC.GET_BY_ID.replace(":id", id)}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to update topic by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  // Role: Admin
  static async deleteTopicById(id: string) {
    try {
      const response = await axios.delete(
        `${coreServiceApiUrl}${API.CORE.TOPIC.GET_BY_ID.replace(":id", id)}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to delete topic by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
