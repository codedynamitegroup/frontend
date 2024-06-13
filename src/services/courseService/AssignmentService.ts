import axios from "axios";
import { API } from "constants/API";
import { CreateAssignmentCommand } from "models/courseService/entity/create/CreateAssignmentCommand";
import { CreateIntroAttachmentCommand } from "models/courseService/entity/create/CreateIntroAttachmentCommand";
import { UpdateAssignmentCommand } from "models/courseService/entity/update/UpdateAssignmentCommand";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

export class AssignmentService {
  static async getAssignmentsByCourseId(courseId: string) {
    try {
      const response = await axios.get(`${courseServiceApiUrl}${API.COURSE.ASSIGNMENT.DEFAULT}`, {
        params: { courseId }
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch assignments by course id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getAssignmentById(id: string) {
    try {
      const response = await axios.get(
        `${courseServiceApiUrl}${API.COURSE.ASSIGNMENT.GET_BY_ID}`.replace(":id", id)
      );

      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch assignment by id", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async createAssignment(assignment: CreateAssignmentCommand) {
    try {
      const response = await axios.post(
        `${courseServiceApiUrl}${API.COURSE.ASSIGNMENT.CREATE}`,
        assignment
      );
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create assignment", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async updateAssignment(assignment: UpdateAssignmentCommand, assignmentId: string) {
    try {
      const response = await axios.put(
        `${courseServiceApiUrl}${API.COURSE.ASSIGNMENT.UPDATE_BY_ID}`.replace(":id", assignmentId),
        assignment
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to update assignment", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async createIntroAttachment(introAttachment: CreateIntroAttachmentCommand) {
    try {
      const response = await axios.post(
        `${courseServiceApiUrl}${API.COURSE.ASSIGNMENT.INTRO_ATTACHMENT}`,
        introAttachment
      );
      if (response.status === 201) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to create intro attachment", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async updateIntroAttachment(
    introAttachment: CreateIntroAttachmentCommand,
    assignmentId: string
  ) {
    try {
      const response = await axios.put(
        `${courseServiceApiUrl}${API.COURSE.ASSIGNMENT.INTRO_ATTACHMENT}/${assignmentId}`,
        //không có sử dụng params
        introAttachment
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to update intro attachment", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
  static async deleteIntroAttachment(id: string) {
    try {
      const response = await axios.delete(
        `${courseServiceApiUrl}${API.COURSE.ASSIGNMENT.INTRO_ATTACHMENT}/${id}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to delete intro attachment", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
