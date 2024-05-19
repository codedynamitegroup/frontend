import axios from "axios";
import { API } from "constants/API";
import { ContestStartTimeFilterEnum } from "models/coreService/enum/ContestStartTimeFilterEnum";

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
      const response = await axios.get(`${coreServiceApiUrl}${API.CORE.CONTEST.DEFAULT}`, {
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
      console.error("Failed to fetch contests", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }

  static async getMostPopularContests() {
    try {
      const response = await axios.get(`${coreServiceApiUrl}${API.CORE.CONTEST.MOST_POPULAR}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch most popular contests", error);
      return Promise.reject({
        code: error.response?.data?.code || 503,
        status: error.response?.data?.status || "Service Unavailable",
        message: error.response?.data?.message || error.message
      });
    }
  }
}
