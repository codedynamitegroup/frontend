import { createSlice } from "@reduxjs/toolkit";
import { CourseEntity } from "models/courseService/entity/CourseEntity";
import { CourseUserResponse } from "models/courseService/entity/UserCourseEntity";

interface InitialState {
  isLoading: boolean;
  courseId: string | null;
  users: CourseUserResponse[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
  amountStudent: number;
}

const initialState: InitialState = {
  courseId: null,
  isLoading: false,
  users: [],
  currentPage: 0,
  totalItems: 0,
  totalPages: 0,
  amountStudent: 0
};

const courseUserSlice = createSlice({
  name: "courseUser",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setCourseUser: (state, action) => {
      state.courseId = action.payload.courseId;
      state.users = action.payload.users;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    },
    setAmountStudent: (state, action) => {
      state.amountStudent = action.payload.amountStudent;
    }
  }
});

export const { setLoading, setCourseUser, setAmountStudent } = courseUserSlice.actions;

export default courseUserSlice.reducer;
