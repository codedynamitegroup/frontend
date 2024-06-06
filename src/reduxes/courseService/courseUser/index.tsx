import { createSlice } from "@reduxjs/toolkit";
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import { CourseUserResponse } from "models/courseService/entity/UserCourseEntity";

interface InitialState {
  isLoading: boolean;
  users: CourseUserResponse[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  amountStudent: number;
  courses: CourseEntity[];
  currentPageCourse: number;
  totalItemsCourse: number;
  totalPagesCourse: number;
}

const initialState: InitialState = {
  isLoading: false,
  users: [],
  courses: [],
  currentPage: 0,
  totalItems: 0,
  totalPages: 0,
  amountStudent: 0,
  currentPageCourse: 0,
  totalItemsCourse: 0,
  totalPagesCourse: 0
};

const courseUserSlice = createSlice({
  name: "users",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setCourseUser: (state, action) => {
      state.users = action.payload.users;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    },
    setAmountStudent: (state, action) => {
      state.amountStudent = action.payload.amountStudent;
    },
    setCourses: (state, action) => {
      state.courses = action.payload.courses;
      state.currentPageCourse = action.payload.currentPageCourse;
      state.totalItemsCourse = action.payload.totalItemsCourse;
      state.totalPagesCourse = action.payload.totalPagesCourse;
    }
  }
});

export const { setLoading, setCourseUser, setAmountStudent, setCourses } = courseUserSlice.actions;

export default courseUserSlice.reducer;
