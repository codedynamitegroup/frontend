import axios from "axios";
import { API } from "constants/API";
import { UUID } from "crypto";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";

const codeAssessmentServiceApiUrl = process.env.REACT_APP_CODE_ASSESSMENT_SERVICE_API_URL || "";

export class CodeQuestionService {
  static async getCodeQuestion(
    filter: {
      tag: TagEntity[] | null;
      search: string | null;
      difficulty: QuestionDifficultyEnum | null;
      solved: boolean | null;
    },
    pagination: {
      pageSize: number;
      pageNum: number;
    },
    userId: UUID | null
  ) {
    try {
      const response = await axios.get(
        `${codeAssessmentServiceApiUrl}${API.CODE_ASSESSMENT.CODE_QUESTION.DEFAULT}`,
        {
          params: {
            pageNo: pagination.pageNum,
            pageSize: pagination.pageSize,
            tagIds: filter.tag?.map((value) => value.id).join(", "),
            userId: userId,
            search: filter.search,
            difficulty: filter.difficulty,
            solved: filter.solved
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

  static async getDetailCodeQuestion(codeQuestionId: UUID, userId: UUID | null) {
    try {
      const response = await axios.get(
        `${codeAssessmentServiceApiUrl}${API.CODE_ASSESSMENT.CODE_QUESTION.GET_BY_ID.replace(":id", codeQuestionId)}`,
        {
          params: { userId }
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
