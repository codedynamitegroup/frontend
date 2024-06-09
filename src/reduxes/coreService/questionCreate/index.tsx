import { createSlice } from "@reduxjs/toolkit";
import { set } from "date-fns";
import { QuestionEntity } from "models/coreService/entity/QuestionEntity";
import { OVERDUE_HANDLING } from "pages/client/lecturer/ExamManagemenent/CreateExam";

interface InitialState {
  examName: string;
  examDescription: string;
  maxScore: number;
  timeOpen: string;
  timeClose: string;
  timeLimit: number;
  overdueHandling: string;
  maxAttempt: number;
  shuffleQuestions: boolean;
  questionCreate: QuestionEntity[];
  searchQuestion: string;
}

const initState: InitialState = {
  examName: "",
  examDescription: "",
  maxScore: 10,
  timeOpen: new Date().toISOString(),
  timeClose: new Date().toISOString(),
  timeLimit: 0,
  overdueHandling: OVERDUE_HANDLING.AUTOSUBMIT,
  maxAttempt: 0,
  shuffleQuestions: false,
  questionCreate: [],
  searchQuestion: ""
};

const questionCreateSlice = createSlice({
  name: "questionId",
  initialState: initState,
  reducers: {
    setExamNameCreate: (state, action: { payload: string }) => {
      state.examName = action.payload;
    },
    setExamDescriptionCreate: (state, action: { payload: string }) => {
      state.examDescription = action.payload;
    },
    setShuffleQuestionsCreate: (state, action: { payload: boolean }) => {
      state.shuffleQuestions = action.payload;
    },
    setMaxScoreCreate: (state, action: { payload: number }) => {
      state.maxScore = action.payload;
    },
    setTimeOpenCreate: (state, action: { payload: string }) => {
      state.timeOpen = action.payload;
    },
    setTimeCloseCreate: (state, action: { payload: string }) => {
      state.timeClose = action.payload;
    },
    setTimeLimitCreate: (state, action: { payload: number }) => {
      state.timeLimit = action.payload;
    },
    setOverdueHandlingCreate: (state, action: { payload: string }) => {
      state.overdueHandling = action.payload;
    },
    setMaxAttemptCreate: (state, action: { payload: number }) => {
      state.maxAttempt = action.payload;
    },
    setQuestionCreate: (state, action) => {
      state.questionCreate.push(action.payload);
    },
    clearQuestionCreate: (state) => {
      state.questionCreate = [];
    },
    setQuestionCreateFromBank(state, action: { payload: QuestionEntity[] }) {
      state.questionCreate.push(...action.payload);
    },
    clearExamCreate: (state) => {
      state.examName = "";
      state.examDescription = "";
      state.maxScore = 10;
      state.timeOpen = new Date().toISOString();
      state.timeClose = new Date().toISOString();
      state.timeLimit = 0;
      state.overdueHandling = OVERDUE_HANDLING.AUTOSUBMIT;
      state.maxAttempt = 0;
      state.questionCreate = [];
    },
    setSearchQuestion: (state, action: { payload: string }) => {
      state.searchQuestion = action.payload;
    }
  }
});

export const {
  setQuestionCreate,
  clearQuestionCreate,
  setQuestionCreateFromBank,
  setExamNameCreate,
  setExamDescriptionCreate,
  setShuffleQuestionsCreate,
  setMaxScoreCreate,
  setTimeOpenCreate,
  setTimeCloseCreate,
  setTimeLimitCreate,
  setOverdueHandlingCreate,
  setMaxAttemptCreate,
  clearExamCreate,
  setSearchQuestion
} = questionCreateSlice.actions;

export default questionCreateSlice.reducer;
