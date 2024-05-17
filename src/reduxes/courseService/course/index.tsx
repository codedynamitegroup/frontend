import { createSlice } from "@reduxjs/toolkit";
import { CourseEntity } from "models/courseService/entity/CourseEntity";

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
    }
  }
});

export const { setLoading, setCourses } = courseSlice.actions;

export default courseSlice.reducer;
