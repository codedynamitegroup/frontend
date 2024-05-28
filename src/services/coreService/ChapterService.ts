import axios from "axios";
import { API } from "constants/API";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class ChapterService {
  static async getChaptersByCertificateCourseIdResponse(id: string) {
    try {
      const response = await axios.get(
        `${coreServiceApiUrl}${API.CORE.CHAPTER.DEFAULT.replace(":certificateCourseId", id)}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch chapters by certificate course id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
