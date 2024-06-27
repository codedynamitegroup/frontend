import { API } from "constants/API";
import { NotificationComponentTypeEnum } from "models/courseService/enum/NotificationComponentTypeEnum";
import { NotificationEventTypeEnum } from "models/courseService/enum/NotificationEventTypeEnum";
import api from "utils/api";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export interface CreateEventCalendarEvent {
  name: string;
  description: string;
  eventType: NotificationEventTypeEnum;
  startTime: string;
  endTime?: string;
  userId?: string;
  courseId?: string;
  examId?: string;
  assignmentId?: string;
  contestId?: string;
  component: NotificationComponentTypeEnum;
}

export interface UpdateEventCalendarEvent {
  name?: string;
  description?: string;
  eventType?: NotificationEventTypeEnum;
  startTime?: string;
  endTime?: string;
  userId?: string;
  courseId?: string;
  examId?: string;
  assignmentId?: string;
  contestId?: string;
  component?: NotificationComponentTypeEnum;
}

export class EventCalendarService {
  static async getEventCalendars({
    courseId,
    fromTime,
    toTime
  }: {
    courseId?: string;
    fromTime: string;
    toTime: string;
  }) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.EVENT_CALENDAR.DEFAULT}`, {
        courseId,
        fromTime,
        toTime
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

  static async createEventCalendar(data: CreateEventCalendarEvent) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).post(`${API.COURSE.EVENT_CALENDAR.CREATE}`, data);
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

  static async updateEventCalendar(id: string, data: UpdateEventCalendarEvent) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).put(`${API.COURSE.EVENT_CALENDAR.UPDATE_BY_ID.replace(":id", id)}`, data);
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

  static async deleteEventCalendarById(id: string) {
    try {
      const response = await api({
        baseURL: courseServiceApiUrl,
        isAuthorization: true
      }).delete(API.COURSE.EVENT_CALENDAR.DELETE_BY_ID.replace(":id", id));
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
