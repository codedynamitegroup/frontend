import axios from "axios";
import { API } from "constants/API";

const codeAssessmentServiceApiUrl = process.env.REACT_APP_CODE_ASSESSMENT_SERVICE_API_URL || "";

export class TagService {
  static async getAlgorithmTag(countCodeQuestion: boolean) {
    try {
      const response = await axios.get(
        `${codeAssessmentServiceApiUrl}${API.CODE_ASSESSMENT.TAG.DEFAULT}`,
        {
          params: {
            countCodeQuestion,
            tagType: "ALGORITHM"
          }
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch algorithm tags", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
