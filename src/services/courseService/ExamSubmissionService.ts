import { API } from "constants/API";
import api from "utils/api";
import { EndExamCommand, StartExamCommand } from "models/courseService/entity/ExamEntity";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class ExamSubmissionService {
  static async startExam(examData: StartExamCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.EXAM.START}`, examData);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to start exam", error);
      return Promise.reject({
        code: error?.code || 503,
        status: error?.status || "Service Unavailable",
        message: error?.message || error.message
      });
    }
  }

  static async endExam(examData: EndExamCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).patch(`${API.COURSE.EXAM.END}`, examData);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to end exam", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getExamSubmissionById(examSubmissionId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.EXAM_SUBMISSION.SUBMISSION_DETAIL.replace(":id", examSubmissionId)}`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch exam submission", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getAllAttemptByExamIdAndUserId(examId: string, userId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(
        `${API.COURSE.EXAM_SUBMISSION.SUBMISSION_STUDENT.replace(":id", examId)}?userId=${userId}`
      );
      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch exam attempts of student", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getLatestOnGoingExamSubmission(examId: string, userId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.EXAM_SUBMISSION.ONGOING_SUBMISSION_DETAIL}`, {
        params: {
          examId: examId,
          userId: userId
        }
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch exam submission", error);
      return Promise.reject({
        code: error?.code || 503,
        status: error?.status || "Service Unavailable",
        message: error?.message || error.message
      });
    }
  }

  static async getStudentExamSubmission(examId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.EXAM_SUBMISSION.STUDENT_EXAM_SUBMISSION.replace(":id", examId)}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch exam submission", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async setGradeStatus(examSubmissionId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).patch(`${API.COURSE.EXAM_SUBMISSION.SET_GRADE_STATUS.replace(":id", examSubmissionId)}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to set grade status", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
