import axios from "axios";
import { API } from "constants/API";
import { ExamCreateRequest } from "models/courseService/entity/ExamEntity";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class ExamService {
  static async getExamsByCourseId(
    courseId: string
    // {
    //   search = "",
    //   pageNo = 0,
    //   pageSize = 10
    // }: {
    //   search?: string;
    //   pageNo?: number;
    //   pageSize?: number;
    // }
  ) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.EXAM.DEFAULT.replace(":courseId", courseId)}`
      );
      // params: {
      //   search,
      //   pageNo,
      //   pageSize
      // }
      // });

      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch exams", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getExamById(examId: string) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.EXAM.GET_BY_ID.replace(":id", examId)}`
      );
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch exam", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getExamQuestionById(examId: string, currentPage: number | null) {
    try {
      const tempPage = currentPage !== null ? currentPage : "";
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.EXAM_QUESTION.DEFAULT.replace(":examId", examId)}?currentPage=${tempPage}`
      );
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch exam", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async createExam(examData: ExamCreateRequest) {
    try {
      const response = await axios.post(
        `${courseServiceApiUrl}${API.COURSE.EXAM.CREATE}`,
        examData
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create exam", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
