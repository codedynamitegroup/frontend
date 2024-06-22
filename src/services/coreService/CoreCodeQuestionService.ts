import { API } from "constants/API";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import api from "utils/api";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class CoreCodeQuestionService {
  static async getAdminCodeQuestions({
    search,
    isPublic,
    difficulty,
    pageNo,
    pageSize
  }: {
    search?: string;
    isPublic?: boolean;
    difficulty?: QuestionDifficultyEnum;
    pageNo: number;
    pageSize: number;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).get(API.CORE.QUESTION.CODE_QUESTION.GET_ALL_BY_ADMIN, {
        params: {
          pageNo,
          pageSize,
          search,
          isPublic,
          difficulty
        }
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch admin code questions", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  // static async getOrgAdminCodeQuestions({
  //   orgId,
  //   search,
  //   isPublic,
  //   difficulty,
  //   pageNo,
  //   pageSize
  // }: {
  //   orgId: string;
  //   search?: string;
  //   isPublic?: boolean;
  //   difficulty?: QuestionDifficultyEnum;
  //   pageNo: number;
  //   pageSize: number;
  // }) {
  //   try {
  //     const response = await api({
  //       baseURL: coreServiceApiUrl,
  //       isAuthorization: true
  //     }).get(API.CORE.QUESTION.CODE_QUESTION.GET_ALL_BY_ORG_ADMIN, {
  //       params: {
  //         orgId,
  //         pageNo,
  //         pageSize,
  //         search,
  //         isPublic,
  //         difficulty
  //       }
  //     });

  //     if (response.status === 200) {
  //       return response.data;
  //     }
  //   } catch (error: any) {
  //     console.error("Failed to fetch org admin code questions", error);
  //     return Promise.reject({
  //       code: error.response?.data?.code || 503,
  //       status: error.response?.data?.status || "Service Unavailable",
  //       message: error.response?.data?.message || error.message
  //     });
  //   }
  // }

  static async getOrgAdminIsAllowedToImportCodeQuestions({
    orgId,
    search,
    isPublic,
    difficulty,
    pageNo,
    pageSize
  }: {
    orgId: string;
    search?: string;
    isPublic?: boolean;
    difficulty?: QuestionDifficultyEnum;
    pageNo: number;
    pageSize: number;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).get(API.CORE.QUESTION.CODE_QUESTION.GET_IS_ALLOWED_TO_IMPORT_BY_ORG_ADMIN, {
        params: {
          orgId,
          pageNo,
          pageSize,
          search,
          isPublic,
          difficulty
        }
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch org admin is allowed to import code questions", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
