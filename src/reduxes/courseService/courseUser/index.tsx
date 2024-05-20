import { createSlice } from "@reduxjs/toolkit";
import { CourseUserResponse } from "models/courseService/entity/UserCourseEntity";

interface InitialState {
  isLoading: boolean;
  users: CourseUserResponse[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

const initialState: InitialState = {
  isLoading: false,
  users: [],
  currentPage: 0,
  totalItems: 0,
  totalPages: 0
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
    }
  }
});

export const { setLoading, setCourseUser } = courseUserSlice.actions;

export default courseUserSlice.reducer; 