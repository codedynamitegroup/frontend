import { API } from "constants/API";
import api from "utils/api";
import {
  PostMultipleChoiceQuestion,
  PutMultipleChoiceQuestion
} from "models/coreService/entity/MultipleChoiceQuestionEntity";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class MultichoiceQuestionService {
  static async createMultichoiceQuestion(multipleChoiceQuestionData: PostMultipleChoiceQuestion) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.QUESTION.MULTIPLE_CHOICE_QUESTION.CREATE}`, multipleChoiceQuestionData);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create multiple choice question", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getMultiChoiceQuestionByQuestionId(questionId: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).get(
        `${API.CORE.QUESTION.MULTIPLE_CHOICE_QUESTION.GET_BY_QUESTION_ID.replace(":questionId", questionId)}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to get multiple choice question by question id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async updateMultichoiceQuestion(mutlichoiceQuestionData: PutMultipleChoiceQuestion) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).put(`${API.CORE.QUESTION.MULTIPLE_CHOICE_QUESTION.UPDATE}`, mutlichoiceQuestionData);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to update multiple choice question", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
