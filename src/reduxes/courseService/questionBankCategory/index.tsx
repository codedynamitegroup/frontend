import { createSlice } from "@reduxjs/toolkit";
import { QuestionEntity } from "models/coreService/entity/QuestionEntity";
import { QuestionBankCategoryEntity } from "models/courseService/entity/QuestionBankCategoryEntity";

interface InitialState {
  isLoading: boolean;
  tab: string;
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
  tab: "1",
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
    },
    setTab: (state, action: { payload: string }) => {
      state.tab = action.payload;
    }
  }
});

export const { setLoading, setCategories, setCategoryDetails, setQuestionsBank, setTab } =
  questionBankCategorySlice.actions;

export default questionBankCategorySlice.reducer;
