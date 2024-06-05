import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ExamEntity } from "models/courseService/entity/ExamEntity";
import { GetQuestionExam } from "models/courseService/entity/QuestionEntity";

export interface InitialState {
  examId: string;
  startAt?: string;
  endAt?: string;
  examData: ExamEntity;
  questionList: {
    flag: boolean;
    answered: boolean;
    content: string;
    questionData: GetQuestionExam;
    files?: {
      fileUrl: string;
      fileName: string;
    }[];
  }[];
}

const initState: InitialState = {
  examId: "",
  examData: {
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
  startAt: undefined,
  endAt: undefined,
  questionList: []
};

const takeExamSlice = createSlice({
  name: "takeExam",
  initialState: initState,
  reducers: {
    setExam: (
      state,
      action: PayloadAction<{
        examId: string;
        startAt: string;
        questionList: {
          flag: boolean;
          answered: boolean;
          content: string;
          questionData: GetQuestionExam;
          files?: {
            fileUrl: string;
            fileName: string;
          }[];
        }[];
      }>
    ) => {
      state.examId = action.payload.examId;
      state.startAt = action.payload.startAt;
      state.questionList = action.payload.questionList;
      return state;
    },
    setExamData: (state, action: PayloadAction<ExamEntity>) => {
      state.examData = action.payload;
      return state;
    },
    setExamId: (state, action: PayloadAction<string>) => {
      state.examId = action.payload;
      return state;
    },
    setQuestionList: (
      state,
      action: PayloadAction<
        { flag: boolean; answered: boolean; content: string; questionData: GetQuestionExam }[]
      >
    ) => {
      state.questionList = action.payload;
      return state;
    },
    setFlag: (state, action: PayloadAction<{ id: string; flag: boolean }>) => {
      const index = state.questionList.findIndex(
        (question) => question.questionData.id === action.payload.id
      );
      if (index !== -1) state.questionList[index].flag = action.payload.flag;
      return state;
    },
    setAnswered: (
      state,
      action: PayloadAction<{ id: string; answered: boolean; content: string }>
    ) => {
      const index = state.questionList.findIndex(
        (question) => question.questionData.id === action.payload.id
      );

      if (index !== -1) {
        state.questionList[index].answered = action.payload.answered;
        state.questionList[index].content = action.payload.content;
      }
      return state;
    },

    addFileToExamQuesiton: (
      state,
      action: PayloadAction<{ id: string; fileUrl: string; fileName: string }>
    ) => {
      const index = state.questionList.findIndex(
        (question) => question.questionData.id === action.payload.id
      );

      console.log("index redux", index);
      console.log("curr files", action.payload.fileUrl);

      if (index !== -1) {
        state.questionList[index].files?.push({
          fileUrl: action.payload.fileUrl,
          fileName: action.payload.fileName
        });
      }
      return state;
    },
    removeFileFromExamQuestion: (state, action: PayloadAction<{ id: string; fileUrl: string }>) => {
      const index = state.questionList.findIndex(
        (question) => question.questionData.id === action.payload.id
      );

      if (index !== -1) {
        state.questionList[index].files = state.questionList[index].files?.filter(
          (file) => file.fileUrl !== action.payload.fileUrl
        );
      }
      return state;
    },
    removeAllFilesFromExamQuestion: (state, action: PayloadAction<string>) => {
      const index = state.questionList.findIndex(
        (question) => question.questionData.id === action.payload
      );

      if (index !== -1) {
        state.questionList[index].files = [];
      }
      return state;
    }
  }
});

export const {
  setExamId,
  setQuestionList,
  setFlag,
  setAnswered,
  setExam,
  addFileToExamQuesiton,
  removeFileFromExamQuestion,
  removeAllFilesFromExamQuestion,
  setExamData
} = takeExamSlice.actions;

export default takeExamSlice.reducer;
