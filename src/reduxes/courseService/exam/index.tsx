import { createSlice } from "@reduxjs/toolkit";
import { ExamEntity } from "models/courseService/entity/ExamEntity";
import { setExam } from "reduxes/TakeExam";

interface InitialState {
  isLoading: boolean;
  exams: {
    exams: ExamEntity[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
  examDetail: ExamEntity;
  examOverview: {
    numberOfStudents: number;
    submitted: number;
  };
}

const initialState: InitialState = {
  isLoading: false,
  exams: {
    exams: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  },
  examDetail: {
    id: "",
    courseId: "",
    name: "",
    scores: 0,
    maxScores: 0,
    timeOpen: new Date(),
    timeClose: new Date(),
    timeLimit: 0,
    intro: "",
    overdueHanding: "",
    canRedoQuestions: false,
    maxAttempts: 0,
    shuffleAnswers: false,
    gradeMethod: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  examOverview: {
    numberOfStudents: 0,
    submitted: 0
  }
};

const examSlice = createSlice({
  name: "exams",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setExams: (state, action) => {
      state.exams.exams = action.payload.exams;
      state.exams.currentPage = action.payload.currentPage;
      state.exams.totalItems = action.payload.totalItems;
      state.exams.totalPages = action.payload.totalPages;
    },
    setExamDetail: (state, action) => {
      state.examDetail = action.payload;
    },
    setExamOverview: (state, action) => {
      state.examOverview.numberOfStudents = action.payload.numberOfStudents;
      state.examOverview.submitted = action.payload.submitted;
    }
  }
});

export const { setLoading, setExams, setExamDetail, setExamOverview } = examSlice.actions;
export default examSlice.reducer;
