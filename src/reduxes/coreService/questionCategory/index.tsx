import { createSlice } from "@reduxjs/toolkit";
import { QuestionEntity } from "models/coreService/entity/QuestionEntity";

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
  name: "questionResponses",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setQuestionsCategory: (state, action) => {
      state.questions = action.payload.questionResponses;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    }
  }
});

export const { setLoading, setQuestionsCategory } = questionSlice.actions;

export default questionSlice.reducer;
