import api from "utils/api";
import { API } from "constants/API";
import { UUID } from "crypto";
import { code } from "@uiw/react-md-editor";

const codeAssessmentServiceApiUrl = process.env.REACT_APP_CODE_ASSESSMENT_SERVICE_API_URL || "";

export class CodeSubmissionService {
  static async getDetailCodeSubmission(codeQuestionId: UUID) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl
        // isAuthorization: true
      }).get(`${API.CODE_ASSESSMENT.CODE_SUBMISSION.GET_BY_ID.replace(":id", codeQuestionId)}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getCodeSubmissionList(codeQuestionId: UUID, pageNo: number, pageSize: number) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl
        // isAuthorization: true
      }).get(`${API.CODE_ASSESSMENT.CODE_SUBMISSION.DEFAULT}`, {
        params: {
          pageNo,
          pageSize,
          codeQuestionId
        }
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
