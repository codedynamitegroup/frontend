import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IsRegisteredFilterEnum } from "models/coreService/enum/IsRegisteredFilterEnum";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

interface InitialState {
  isLoading: boolean;
  mostEnrolledCertificateCourses: CertificateCourseEntity[];
  certificateCourses: CertificateCourseEntity[];
  certificateCourseDetails: CertificateCourseEntity | null;
}

const initState: InitialState = {
  isLoading: false,
  mostEnrolledCertificateCourses: [],
  certificateCourses: [],
  certificateCourseDetails: null
};

export const fetchAllCertificateCourses = createAsyncThunk(
  "certificateCourses/fetchAll",
  async (
    data: {
      courseName: string;
      filterTopicIds: string[];
      isRegisteredFilter: IsRegisteredFilterEnum;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(`${coreServiceApiUrl}certificate-courses`, {
        courseName: data.courseName,
        filterTopicIds: data.filterTopicIds,
        isRegisteredFilter: data.isRegisteredFilter
      });
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to fetch certificate courses", response.data);
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch certificate courses", error);
      return rejectWithValue(error);
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
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("Failed to register certificate course", error);
      return rejectWithValue(error);
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
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch certificate course details", error);
      return rejectWithValue(error);
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
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("Failed to delete certificate course", error);
      return rejectWithValue(error);
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
