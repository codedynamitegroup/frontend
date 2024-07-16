import { API } from "constants/API";
import { PostTopicEntity } from "models/coreService/entity/TopicEntity";
import api from "utils/api";

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
      const response = await api({
        baseURL: coreServiceApiUrl
      }).get(`${API.CORE.TOPIC.DEFAULT}`, {
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
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }

  // Role: User
  static async getTopicById(id: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).get(`${API.CORE.TOPIC.GET_BY_ID.replace(":id", id)}`);
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

  // Role: Admin
  static async updateTopicById(id: string, data: any) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).put(`${API.CORE.TOPIC.GET_BY_ID.replace(":id", id)}`, data);
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

  // Role: Admin
  static async deleteTopicById(id: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).delete(`${API.CORE.TOPIC.GET_BY_ID.replace(":id", id)}`);
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

  static async getProgrammingLanguage({
    pageNo = 0,
    pageSize = 10,
    search,
    selectedProgrammingLanguageIds
  }: {
    pageNo?: number;
    pageSize?: number;
    search: string;
    selectedProgrammingLanguageIds: string[];
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.TOPIC.GET_PROGRAMMING_LANGUAGE}`, {
        params: {
          pageNo: pageNo,
          pageSize: pageSize,
          search: search
        },
        selectedProgrammingLanguageIds
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
  static async getProgrammingLanguageByIds({
    pageNo = 0,
    pageSize = 10,
    search,
    selectedProgrammingLanguageIds
  }: {
    pageNo?: number;
    pageSize?: number;
    search: string;
    selectedProgrammingLanguageIds: string[];
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.TOPIC.GET_PROGRAMMING_LANGUAGE_BY_Id}`, {
        params: {
          pageNo: pageNo,
          pageSize: pageSize,
          search: search
        },
        selectedProgrammingLanguageIds
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

  static async createTopic(data: PostTopicEntity) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.TOPIC.CREATE}`, data);

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
