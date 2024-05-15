import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { CourseEntity } from "models/courseService/entity/CourseEntity";

const courseServiceApiUrl = process.env.REACT_APP_COURSE_SERVICE_API_URL || "";

interface InitialState {
  isLoading: boolean;
  courses: CourseEntity[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

const initialState: InitialState = {
  isLoading: false,
  courses: [],
  currentPage: 0,
  totalItems: 0,
  totalPages: 0
};

export const fetchAllCourses = createAsyncThunk(
  "courses/fetchAll",
  async (
    data: {
      search?: string;
      pageNo: number;
      pageSize: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${courseServiceApiUrl}course`, {
        params: {
          search: data.search,
          pageNo: data.pageNo,
          pageSize: data.pageSize
        }
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses", error);
      return rejectWithValue(error);
    }
  }
);

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCourses.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllCourses.fulfilled, (state, action) => {
      state.isLoading = false;
      state.courses = action.payload.courses;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchAllCourses.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export default courseSlice.reducer;

export const {} = courseSlice.actions;

