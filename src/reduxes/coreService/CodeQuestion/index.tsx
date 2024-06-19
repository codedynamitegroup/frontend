import { createSlice } from "@reduxjs/toolkit";
import { CodeQuestion } from "models/coreService/entity/QuestionEntity";

interface InitialState {
  isLoading: boolean;
  questions: CodeQuestion[];
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

const codeQuestionSlice = createSlice({
  name: "codeQuestion",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setCodeQuestions: (state, action) => {
      state.questions = action.payload.qtypeCodeQuestions;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    }
  }
});

export const { setLoading, setCodeQuestions } = codeQuestionSlice.actions;

export default codeQuestionSlice.reducer;
