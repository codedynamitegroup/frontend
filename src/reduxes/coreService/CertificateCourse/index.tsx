import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

interface InitialState {
  isLoading: boolean;
  mostEnrolledCertificateCourses: CertificateCourseEntity[];
  certificateCourses: CertificateCourseEntity[];
  error?: {
    api: string;
    code: number;
    status: string;
    message: string;
  };
}

const initState: InitialState = {
  isLoading: false,
  mostEnrolledCertificateCourses: [],
  certificateCourses: [],
  error: undefined
};

export const fetchAllCertificateCourses = createAsyncThunk(
  "certificateCourses/fetchAll",
  async (
    data: {
      courseName: string;
      filterTopicIds: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${coreServiceApiUrl}certificate-courses`, {
        courseName: data.courseName,
        filterTopicIds: data.filterTopicIds
      });
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to fetch certificate courses", response.data);
        return rejectWithValue({
          api: "fetchAllCertificateCourses",
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to fetch certificate courses", error.response?.data || error.message);
        return rejectWithValue({
          api: "fetchAllCertificateCourses",
          code: error.response?.status || 503,
          status: error.response?.statusText || "Service Unavailable",
          message: error.response?.data || error.message
        });
      } else {
        console.error("Failed to fetch certificate courses", error);
        // Just a stock error
        return rejectWithValue({
          api: "fetchAllCertificateCourses",
          code: 500,
          status: "Internal Server Error",
          message: "Failed to fetch certificate courses"
        });
      }
    }
  }
);

export const registerCertificateCourse = createAsyncThunk(
  "certificateCourses/register",
  async (
    data: {
      ceritificateCourseId: string;
      userId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${coreServiceApiUrl}certificate-courses/register`, {
        ceritificateCourseId: data.ceritificateCourseId,
        userId: data.userId
      });
      if (response.status === 201) {
        return response.data;
      } else {
        console.error("Failed to fetch certificate courses", response.data);
        return rejectWithValue({
          api: "registerCertificateCourse",
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to fetch certificate courses", error.response?.data || error.message);
        return rejectWithValue({
          api: "registerCertificateCourse",
          code: error.response?.status || 503,
          status: error.response?.statusText || "Service Unavailable",
          message: error.response?.data || error.message
        });
      } else {
        console.error("Failed to fetch certificate courses", error);
        // Just a stock error
        return rejectWithValue({
          api: "registerCertificateCourse",
          code: 500,
          status: "Internal Server Error",
          message: "Failed to fetch certificate courses"
        });
      }
    }
  }
);

export const fetchCertificateCourseDetails = createAsyncThunk(
  "certificateCourses/fetchDetails",
  async (
    data: {
      id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${coreServiceApiUrl}certificate-courses/${data.id}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to fetch certificate course details", response.data);
        return rejectWithValue({
          api: "fetchCertificateCourseDetails",
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Failed to fetch certificate course details",
          error.response?.data || error.message
        );
        return rejectWithValue({
          api: "fetchCertificateCourseDetails",
          code: error.response?.status || 503,
          status: error.response?.statusText || "Service Unavailable",
          message: error.response?.data || error.message
        });
      } else {
        console.error("Failed to fetch certificate course details", error);
        // Just a stock error
        return rejectWithValue({
          api: "fetchCertificateCourseDetails",
          code: 500,
          status: "Internal Server Error",
          message: "Failed to fetch certificate course details"
        });
      }
    }
  }
);

export const deleteCertificateCourse = createAsyncThunk(
  "certificateCourses/delete",
  async (
    data: {
      id: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete(`${coreServiceApiUrl}certificate-courses/${data.id}`);
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to delete certificate course", response.data);
        return rejectWithValue({
          api: "deleteCertificateCourse",
          code: response.data.code,
          status: response.data.status,
          message: response.data.message
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to delete certificate course", error.response?.data || error.message);
        return rejectWithValue({
          api: "deleteCertificateCourse",
          code: error.response?.status || 503,
          status: error.response?.statusText || "Service Unavailable",
          message: error.response?.data || error.message
        });
      } else {
        console.error("Failed to delete certificate course", error);
        // Just a stock error
        return rejectWithValue({
          api: "deleteCertificateCourse",
          code: 500,
          status: "Internal Server Error",
          message: "Failed to delete certificate course"
        });
      }
    }
  }
);

const certificateCourseSlice = createSlice({
  name: "certificateCourse",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCertificateCourses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllCertificateCourses.fulfilled, (state, action) => {
      state.isLoading = false;
      state.certificateCourses = action.payload.certificateCourses;
      state.mostEnrolledCertificateCourses = action.payload.mostEnrolledCertificateCourses;
    });
    builder.addCase(fetchAllCertificateCourses.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const {} = certificateCourseSlice.actions;

export default certificateCourseSlice.reducer;
