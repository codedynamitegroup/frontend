import { API } from "constants/API";
import { CreateContestCommand } from "models/coreService/create/CreateContestCommand";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";
import api from "utils/api";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

export class ContestService {
  static async getContests({
    searchName,
    startTimeFilter = ContestStartTimeFilterEnum.ALL,
    pageNo = 0,
    pageSize = 10
  }: {
    searchName?: string;
    startTimeFilter?: ContestStartTimeFilterEnum;
    pageNo?: number;
    pageSize?: number;
  }) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).get(`${API.CORE.CONTEST.DEFAULT}`, {
        params: {
          searchName,
          startTimeFilter,
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

  static async getMostPopularContests() {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).get(`${API.CORE.CONTEST.MOST_POPULAR}`);
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

  static async getContestLeaderboard(contestId: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).get(`${API.CORE.CONTEST.LEADERBOARD.replace(":id", contestId)}`);
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

  static async getContestById(id: string) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl
      }).get(`${API.CORE.CONTEST.GET_BY_ID.replace(":id", id)}`);
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

  static async createContest(data: CreateContestCommand) {
    try {
      const response = await api({
        baseURL: coreServiceApiUrl,
        isAuthorization: true
      }).post(`${API.CORE.CONTEST.CREATE}`, data);
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
