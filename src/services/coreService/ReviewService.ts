import { API } from "constants/API";
import api from "utils/api";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class ReviewService {
  static async getReviewsByCertificateCourseId({
    certificateCourseId,
    pageNo = 0,
    pageSize = 5
  }: {
    certificateCourseId: string;
    pageNo?: number;
    pageSize?: number;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).get(`${API.CORE.REVIEW.DEFAULT}`, {
        params: {
          certificateCourseId,
          pageNo,
          pageSize
        }
      });
      if (response.status === 200) {
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

  static async createReview({
    certificateCourseId,
    rating,
    content
  }: {
    certificateCourseId: string;
    rating: number;
    content: string;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.REVIEW.CREATE}`, {
        certificateCourseId,
        rating,
        content
      });
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

  static async getEachRatingCountByCertificateCourseId({
    certificateCourseId
  }: {
    certificateCourseId: string;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).get(`${API.CORE.REVIEW.COUNT_BY_CERTIFICATE_COURSE_ID}`, {
        params: {
          certificateCourseId
        }
      });
      if (response.status === 200) {
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
