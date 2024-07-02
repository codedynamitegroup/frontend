import { API } from "constants/API";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class NotificationService {
  static async getMyNotifications({
    pageNo = 0,
    pageSize = 10
  }: {
    pageNo?: number;
    pageSize?: number;
  }) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).get(`${API.COURSE.NOTIFICATION.MY_NOTIFICATIONS}`, {
        params: {
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

  static async updateReadStatusForNotification(notificationId: string, read: boolean) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).put(API.COURSE.NOTIFICATION.UPDATE_BY_ID.replace(":id", notificationId), null, {
        params: {
          read
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

  static async deleteNotificationById(notificationId: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).delete(API.COURSE.NOTIFICATION.DELETE_BY_ID.replace(":id", notificationId));
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
