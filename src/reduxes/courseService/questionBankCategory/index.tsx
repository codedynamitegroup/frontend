import { createSlice } from "@reduxjs/toolkit";
import { QuestionBankCategoryEntity } from "models/courseService/entity/QuestionBankCategoryEntity";

interface InitialState {
  isLoading: boolean;
  questionBankCategories: QuestionBankCategoryEntity[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

const initialState: InitialState = {
  isLoading: false,
  questionBankCategories: [],
  currentPage: 0,
  totalItems: 0,
  totalPages: 0
};

const questionBankCategorySlice = createSlice({
  name: "questionBankCategory",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setQuestionBankCategories: (state, action) => {
      state.questionBankCategories = action.payload.questionBankCategories;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    }
  }
});

export const { setLoading, setQuestionBankCategories } = questionBankCategorySlice.actions;

export default questionBankCategorySlice.reducer;
