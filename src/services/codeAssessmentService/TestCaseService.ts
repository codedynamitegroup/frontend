import { API } from "constants/API";
import { UUID } from "crypto";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import api from "utils/api";

const codeAssessmentServiceApiUrl = process.env.REACT_APP_CODE_ASSESSMENT_SERVICE_API_URL || "";

export class TestCaseSerivce {
  static async updateTestCases(field: {
    codeQuestionId: string;
    updatedTestCases: {
      id: string;
      inputData: string;
      outputData: string;
      isSample: boolean;
    }[];
    newTestCases: {
      inputData: string;
      outputData: string;
      isSample: boolean;
    }[];
    deletedTestCasesId: string[];
  }) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).put(API.CODE_ASSESSMENT.TEST_CASE.DEFAULT, {
        ...field
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to update test case list", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
