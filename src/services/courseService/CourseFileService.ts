import { AxiosInstance } from "axios";
import { API } from "constants/API";
import api from "utils/api";
import { saveAs } from "file-saver";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class CourseFileService {
  private static apiClient: AxiosInstance = api({
    baseURL: courseServiceApiUrl,
    isAuthorization: true
  });

  static async downloadEssayAttachmentFile(fileId: String) {
    try {
      const token = localStorage.getItem("access_token");

      const response = await this.apiClient.get(
        `${API.COURSE.FILE.DOWNLOAD_ESSAY_ATTACHMENT_FILE}`,
        {
          params: {
            fileId,
            token
          },
          responseType: "blob"
        }
      );

      // Extract filename from response headers
      const contentDisposition = response.headers["content-disposition"];
      const filename = contentDisposition?.split("filename=")[1]?.split(";")[0]?.replace(/"/g, "");

      // Create a new Blob object using the response data
      const blob = new Blob([response.data], { type: response.headers["content-type"] });

      // Use file-saver to save the file
      saveAs(blob, filename);
    } catch (error: any) {}
  }
}
