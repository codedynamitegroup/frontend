import { API } from "constants/API";
import { UUID } from "crypto";
import api from "utils/api";
import { encodeBase64 } from "utils/base64";

const codeAssessmentServiceApiUrl = process.env.REACT_APP_CODE_ASSESSMENT_SERVICE_API_URL || "";
const gateWayServiceApiUrl = process.env.REACT_APP_GATEWAY_SERVICE_API_URL || "";

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

  static async createCodeSubmission(data: {
    codeQuestionId: UUID | string;
    languageId: UUID;
    sourceCode: string;
    contestId?: string;
    cerCourseId?: string;
  }) {
    // const headCode64 = encodeBase64(headCode);
    // const tailCode64 = encodeBase64(tailCode);
    // const bodyCode64 = encodeBase64(bodyCode);
    const sourceCode = data.sourceCode;
    const languageId = data.languageId;
    const codeQuestionId = data.codeQuestionId;
    const sourceCode64 = encodeBase64(sourceCode);
    const callbackUrl = `${gateWayServiceApiUrl}/code-assessment/code-submission/test-case-token`;
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CODE_ASSESSMENT.CODE_SUBMISSION.DEFAULT}`, {
        codeQuestionId,
        languageId,
        sourceCode: sourceCode64,
        // headCode: headCode64,
        // tailCode: tailCode64,
        // bodyCode: bodyCode64,
        callbackUrl,
        contestId: data.contestId ?? null,
        certificateCourseId: data.cerCourseId ?? null
      });
      if (response.status === 202) {
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

  static async getCodeSubmissionList(
    codeQuestionId: UUID | string,
    pageNo: number,
    pageSize: number,
    contestId?: string,
    cerCourseId?: string
  ) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl
        // isAuthorization: true
      }).get(`${API.CODE_ASSESSMENT.CODE_SUBMISSION.DEFAULT}`, {
        params: {
          pageNo,
          pageSize,
          codeQuestionId,
          contestId,
          cerCourseId
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

  static async getAdminCodeSubmissionList({
    cerCourseId,
    contestId,
    pageNo,
    pageSize
  }: {
    cerCourseId?: string;
    contestId?: string;
    pageNo: number;
    pageSize: number;
  }) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).get(`${API.CODE_ASSESSMENT.CODE_SUBMISSION.ADMIN_CODE_SUBMISSION}`, {
        params: {
          pageNo,
          pageSize,
          contestId,
          cerCourseId
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
