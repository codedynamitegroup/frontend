import { createSlice } from "@reduxjs/toolkit";
import { ExamEntity } from "models/courseService/entity/ExamEntity";

interface InitialState {
  isLoading: boolean;
  exams: ExamEntity[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

const initialState: InitialState = {
  isLoading: false,
  exams: [],
  currentPage: 0,
  totalItems: 0,
  totalPages: 0
};

const examSlice = createSlice({
  name: "exams",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setExams: (state, action) => {
      state.exams = action.payload.exams;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    }
  }
});

export const { setLoading, setExams } = examSlice.actions;

export default examSlice.reducer;
