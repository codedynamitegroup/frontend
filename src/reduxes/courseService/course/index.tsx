import { createSlice } from "@reduxjs/toolkit";
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import { CourseDetailEntity } from "models/courseService/entity/detail/CourseDetailEntity";

interface InitialState {
  isLoading: boolean;
  courses: CourseEntity[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  courseDetail: CourseDetailEntity | null;
}

const initialState: InitialState = {
  isLoading: false,
  courses: [],
  currentPage: 0,
  totalItems: 0,
  totalPages: 0,
  courseDetail: null
};

const courseSlice = createSlice({
  name: "course",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setCourses: (state, action) => {
      state.courses = action.payload.courses;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    },
    setCourseDetail: (state, action) => {
      state.courseDetail = action.payload.courseDetail;
    }
  }
});

export const { setLoading, setCourses, setCourseDetail } = courseSlice.actions;

export default courseSlice.reducer;
