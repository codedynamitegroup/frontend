import { API } from "constants/API";
import api from "utils/api";
const codeAssessmentServiceApiUrl = process.env.REACT_APP_CODE_ASSESSMENT_SERVICE_API_URL || "";
export class ProgrammingLanuageService {
  static async getProgrammingLanguages(active: boolean | null) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl
        // isAuthorization: true
      }).get(API.CODE_ASSESSMENT.PROGRAMMING_LANGUAGE.DEFAULT, {
        params: {
          active
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
