import axios from "axios";
import { API } from "constants/API";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import api from "utils/api";

const codeAssessmentServiceApiUrl = process.env.REACT_APP_CODE_ASSESSMENT_SERVICE_API_URL || "";

export class SharedSolutionService {
  static async getDetailSharedSolution(sharedSolutionId: string) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl
      }).get(API.CODE_ASSESSMENT.SHARED_SOLUTION.GET_BY_ID.replace(":id", sharedSolutionId));

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch detail solution", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async getSharedSolution(
    codeQuestionId: string,
    filter: {
      filterTags: TagEntity[] | null;
      searchKey: string | null;
      newest: boolean;
    },

    pagination: {
      pageSize: number;
      pageNum: number;
    }
  ) {
    try {
      const response = await axios.get(
        `${codeAssessmentServiceApiUrl}${API.CODE_ASSESSMENT.SHARED_SOLUTION.DEFAULT}`,
        {
          params: {
            codeQuestionId,
            search: filter.searchKey,
            orderBy: filter.newest ? "DESC" : "ASC",
            filterTagIds: filter.filterTags?.map((value) => value.id).join(", "),
            pageNo: pagination.pageNum,
            pageSize: pagination.pageSize
          }
        }
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch solution", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
