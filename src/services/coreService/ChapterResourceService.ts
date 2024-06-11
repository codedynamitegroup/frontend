import { API } from "constants/API";
import api from "utils/api";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class ChapterResourceService {
  static async markViewedChapterResource(chapterResourceId: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(
        `${API.CORE.CHAPTER.MARK_VIEWED_BY_CHAPTER_RESOURCE_ID.replace(":id", chapterResourceId)}`
      );
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      return Promise.reject({
        code: error.code || 503,
        status: error.status || "Service Unavailable",
        message: error.message
      });
    }
  }
}
