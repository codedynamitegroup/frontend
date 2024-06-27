import axios from "axios";
import { API } from "constants/API";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import api from "utils/api";

const codeAssessmentServiceApiUrl = process.env.REACT_APP_CODE_ASSESSMENT_SERVICE_API_URL || "";

export class SharedSolutionService {
  static async editComment(commentId: string, content: string) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).put(API.CODE_ASSESSMENT.SHARED_SOLUTION.COMMENT.EDIT_OR_DELETE.replace(":id", commentId), {
        content
      });
      if (response.status === 204) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to edit comment", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async deleteComment(commentId: string) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).delete(
        API.CODE_ASSESSMENT.SHARED_SOLUTION.COMMENT.EDIT_OR_DELETE.replace(":id", commentId)
      );
      if (response.status === 204) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to delete comment", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async editSharedSolution(
    sharedSolutionId: string,
    content: string,
    title: string,
    removedTagIds: string[],
    addedTagIds: string[]
  ) {
    try {
      const editSolution = api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).put(API.CODE_ASSESSMENT.SHARED_SOLUTION.GET_BY_ID.replace(":id", sharedSolutionId), {
        title,
        content
      });
      const addTag =
        addedTagIds.length > 0
          ? api({
              baseURL: codeAssessmentServiceApiUrl,
              isAuthorization: true
            }).post(
              `${API.CODE_ASSESSMENT.SHARED_SOLUTION.TAG.DEFAULT.replace(":id", sharedSolutionId)}?tagIds=${addedTagIds.join(", ")}`
            )
          : undefined;
      const removeTag =
        removedTagIds.length > 0
          ? api({
              baseURL: codeAssessmentServiceApiUrl,
              isAuthorization: true
            }).delete(
              API.CODE_ASSESSMENT.SHARED_SOLUTION.TAG.DEFAULT.replace(":id", sharedSolutionId),
              {
                params: {
                  tagIds: removedTagIds.join(", ")
                }
              }
            )
          : undefined;
      const responses = await Promise.all([editSolution, addTag, removeTag]);

      return responses.map((i) => (i ? i.data : i));
    } catch (error: any) {
      console.error("Failed to edit solution", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async deleteSharedSolution(sharedSolutionId: string) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).delete(API.CODE_ASSESSMENT.SHARED_SOLUTION.GET_BY_ID.replace(":id", sharedSolutionId));
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to delete solution", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async createSharedSolution(
    codeQuestionId: string,
    title: string,
    content: string,
    tagIds: string[]
  ) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).post(API.CODE_ASSESSMENT.SHARED_SOLUTION.DEFAULT, {
        codeQuestionId,
        content,
        title,
        tagIds: tagIds
      });
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create solution", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async getRootComments(
    sharedSolutionId: string,
    pageNo: number,
    pageSize: number,
    newest: boolean
  ) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl
      }).get(API.CODE_ASSESSMENT.SHARED_SOLUTION.COMMENT.DEFAULT.replace(":id", sharedSolutionId), {
        params: {
          pageNo,
          pageSize,
          orderBy: newest ? "DESC" : "ASC"
        }
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch comment", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async createComment(data: {
    sharedSolutionId: string;
    replyId?: string;
    content: string;
  }) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).post(
        API.CODE_ASSESSMENT.SHARED_SOLUTION.COMMENT.DEFAULT.replace(":id", data.sharedSolutionId),
        {
          replyId: data.replyId,
          content: data.content
        }
      );

      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create comment", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async getDetailSharedSolution(sharedSolutionId: string) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl
      }).get(API.CODE_ASSESSMENT.SHARED_SOLUTION.GET_BY_ID.replace(":id", sharedSolutionId), {
        withCredentials: true
      });

      if (response.status === 200) {
        console.log('cc')
        console.log(response.headers["set-cookie"]);
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
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        disableHeaderToken: true
      }).get(API.CODE_ASSESSMENT.SHARED_SOLUTION.DEFAULT, {
        params: {
          codeQuestionId,
          search: filter.searchKey,
          orderBy: filter.newest ? "DESC" : "ASC",
          filterTagIds: filter.filterTags?.map((value) => value.id).join(", "),
          pageNo: pagination.pageNum,
          pageSize: pagination.pageSize
        }
      });

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
  static async getRecentSharedSolution(
    pageSize: number,
    pageNo: number,
    newest: boolean,
    sortBy: string
  ) {
    try {
      const response = await api({
        baseURL: codeAssessmentServiceApiUrl,
        isAuthorization: true
      }).get(`${API.CODE_ASSESSMENT.SHARED_SOLUTION.GET_RECENT}`, {
        params: {
          orderBy: newest ? "DESC" : "ASC",
          sortBy: sortBy,
          pageNo: pageNo,
          pageSize: pageSize
        }
      });

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
