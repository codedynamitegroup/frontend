import { API } from "constants/API";
import { CreateAnnoucementCommand } from "models/courseService/entity/create/CreateAnnoucementCommand";
import { UpdateAnnoucementCommand } from "models/courseService/entity/update/UpdateAnnoucementCommand";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class PostService {
  static async createAnnouncement(createAnnoucementCommand: CreateAnnoucementCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.POST.CREATE}`, createAnnoucementCommand);
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create post", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async getPostsByCourseId(
    courseId: string,
    {
      pageNo = 0,
      pageSize = 10
    }: {
      pageNo?: number;
      pageSize?: number;
    }
  ) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.POST.GET_ALL_BY_COURSE_ID.replace(":courseId", courseId)}`, {
        params: {
          pageNo,
          pageSize
        }
      });

      if (response.status === 200) {
        return Promise.resolve(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch posts", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async updatePost(postId: string, updateAnnoucementCommand: UpdateAnnoucementCommand) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).put(`${API.COURSE.POST.UPDATE.replace(":postId", postId)}`, updateAnnoucementCommand);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create exam", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async deletePostById(id: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).delete(`${API.COURSE.POST.DELETE.replace(":postId", id)}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to delete post", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
