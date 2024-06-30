import { PostShortAnswerQuestion } from "models/coreService/entity/ShortAnswerQuestionEntity";
import { API } from "constants/API";
import api from "utils/api";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class ShortAnswerQuestionService {
  static async createShortAnswerQuestion(shortAnswerQuestionData: PostShortAnswerQuestion) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.QUESTION.SHORT_ANSWER_QUESTION.CREATE}`, shortAnswerQuestionData);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create short answer question", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
