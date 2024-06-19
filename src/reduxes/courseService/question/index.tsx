import { createSlice } from "@reduxjs/toolkit";
import { QuestionEntity } from "models/courseService/entity/QuestionEntity";

interface InitialState {
  isLoading: boolean;
  questions: QuestionEntity[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

const initialState: InitialState = {
  isLoading: false,
  questions: [],
  currentPage: 0,
  totalItems: 0,
  totalPages: 0
};

const questionSlice = createSlice({
  name: "question",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setQuestions: (state, action) => {
      state.questions = action.payload.questions;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    },
    clearCodeQuestion: (state) => {
      state.questions = [];
      state.currentPage = 0;
      state.totalItems = 0;
      state.totalPages = 0;
    }
  }
});

export const { setLoading, setQuestions, clearCodeQuestion } = questionSlice.actions;

export default questionSlice.reducer;
