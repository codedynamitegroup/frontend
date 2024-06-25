import { createSlice } from "@reduxjs/toolkit";
import { GradeExamSubmission } from "models/courseService/entity/ExamEntity";

interface InitialState {
  isLoading: boolean;
  examSubmgradeission: {
    grades: GradeExamSubmission[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: InitialState = {
  isLoading: false,
  examSubmgradeission: {
    grades: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  }
};

const gradeExamSubmissionSlice = createSlice({
  name: "gradeExamSubmission",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setGradeExamSubmission: (state, action) => {
      state.examSubmgradeission.grades = action.payload.grades;
      state.examSubmgradeission.currentPage = action.payload.currentPage;
      state.examSubmgradeission.totalItems = action.payload.totalItems;
      state.examSubmgradeission.totalPages = action.payload.totalPages;
    }
  }
});

export const { setLoading, setGradeExamSubmission } = gradeExamSubmissionSlice.actions;

export default gradeExamSubmissionSlice.reducer;
