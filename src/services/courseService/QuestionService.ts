import axios from "axios";
import { API } from "constants/API";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class QuestionService {
  static async getQuestions({
    search = "",
    pageNo = 0,
    pageSize = 10
  }: {
    search?: string;
    pageNo?: number;
    pageSize?: number;
  }) {
    try {
      const response = await axios.get(`${courseServiceApiUrl}${API.COURSE.QUESTION.DEFAULT}`, {
        params: {
          search,
          pageNo,
          pageSize
        }
      });
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch questions", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getQuestionById(questionId: string) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.QUESTION.GET_BY_ID.replace(":id", questionId)}`
      );
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

  static async deleteQuestion(questionId: string) {
    try {
      const response = await axios.delete(
        `${courseServiceApiUrl}${API.COURSE.QUESTION.DELETE_BY_ID.replace(":id", questionId)}`
      );
      if (response.status === 204) {
        return Promise.resolve();
      }
    } catch (error: any) {
      console.error("Failed to delete question", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
