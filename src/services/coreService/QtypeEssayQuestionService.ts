import { API } from "constants/API";
import { PostEssayQuestion, PutEssayQuestion } from "models/coreService/entity/EssayQuestionEntity";
import api from "utils/api";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class EssayQuestionService {
  static async createEssayQuestion(essayQuestionData: PostEssayQuestion) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.QUESTION.ESSAY_QUESTION.CREATE}`, essayQuestionData);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create essay question", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async updateEssayQuestion(essayQuestionData: PutEssayQuestion) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).put(`${API.CORE.QUESTION.ESSAY_QUESTION.UPDATE}`, essayQuestionData);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to update essay question", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
