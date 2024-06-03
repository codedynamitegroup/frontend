import { createSlice } from "@reduxjs/toolkit";
import { QuestionEntity } from "models/coreService/entity/QuestionEntity";
import { QuestionBankCategoryEntity } from "models/courseService/entity/QuestionBankCategoryEntity";

interface InitialState {
  isLoading: boolean;
  categories: {
    questionBankCategories: QuestionBankCategoryEntity[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
  categoryDetails: QuestionBankCategoryEntity | null;
  questions: {
    questionResponses: QuestionEntity[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: InitialState = {
  isLoading: false,
  categories: {
    questionBankCategories: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  },
  categoryDetails: null,
  questions: {
    questionResponses: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  }
};

const questionBankCategorySlice = createSlice({
  name: "questionBankCategory",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setCategories: (state, action) => {
      state.categories.questionBankCategories = action.payload.questionBankCategories;
      state.categories.currentPage = action.payload.currentPage;
      state.categories.totalItems = action.payload.totalItems;
      state.categories.totalPages = action.payload.totalPages;
    },
    setCategoryDetails: (state, action) => {
      state.categoryDetails = action.payload;
    },
    setQuestionsBank: (state, action) => {
      state.questions = action.payload.questionResponses;
      state.questions.currentPage = action.payload.currentPage;
      state.questions.totalItems = action.payload.totalItems;
      state.questions.totalPages = action.payload.totalPages;
    }
  }
});

export const { setLoading, setCategories, setCategoryDetails, setQuestionsBank } =
  questionBankCategorySlice.actions;

export default questionBankCategorySlice.reducer;
