import axios from "axios";
import { API } from "constants/API";
import {
  PostEssayQuestion,
  PostMultipleChoiceQuestion,
  PostQuestionDetailList,
  PostShortAnswerQuestion,
  QuestionCloneRequest
} from "models/coreService/entity/QuestionEntity";
import api from "utils/api";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class QuestionService {
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

  static async getQuestionDetail(questionDetailList: PostQuestionDetailList) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.QUESTION.QUESTION_DETAIL}`, questionDetailList);
      if (response.status === 200) {
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

  static async getQuestionsByQuestionId(questionId: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).get(`${API.CORE.QUESTION.GET_BY_ID.replace(":id", questionId)}`);
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch question", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getQuestionsByCategoryId({
    categoryId,
    isOrgQuestionBank,
    search = "",
    pageNo = 0,
    pageSize = 10
  }: {
    categoryId: string;
    isOrgQuestionBank?: boolean;
    search?: string;
    pageNo?: number;
    pageSize?: number;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).get(`${API.CORE.QUESTION.GET_BY_CATEGORY_ID.replace(":categoryId", categoryId)}`, {
        params: {
          isOrgQuestionBank,
          search,
          pageNo,
          pageSize
        }
      });
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch questions by category id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async deleteQuestionById(questionId: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).delete(`${API.CORE.QUESTION.DELETE_BY_ID.replace(":id", questionId)}`);
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to delete question by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async cloneQuestionByIdIn(questions: QuestionCloneRequest) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.QUESTION.CLONE}`, questions);
      if (response.status === 201) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to clone question by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
