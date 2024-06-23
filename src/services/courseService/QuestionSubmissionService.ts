import { API } from "constants/API";
import {
  GetQuestionSubmissionCommand,
  SubmitQuestion,
  SubmitQuestionList
} from "models/courseService/entity/QuestionSubmissionEntity";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class QuestionSubmissionService {
  static async submitQuestionList(questionListData: SubmitQuestionList) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.QUESTION_SUBMISSION.SUBMIT_LIST}`, questionListData);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to submit question list", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async submitQuestion(questionData: SubmitQuestion) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.QUESTION_SUBMISSION.SUBMIT_ONE}`, questionData);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to submit question list", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getQuestionSubmission(getQuestionCommand: GetQuestionSubmissionCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(
        `${API.COURSE.QUESTION_SUBMISSION.GET_QUESITON_SUBMISSION_BY_QUESTION_ID}`,
        getQuestionCommand
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to get question submission", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
