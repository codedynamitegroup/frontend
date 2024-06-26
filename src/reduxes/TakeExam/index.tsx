import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GetQuestionExam } from "models/courseService/entity/QuestionEntity";

export interface InitialState {
  examId: string;
  questionList: {
    flag: boolean;
    answered: boolean;
    content: string;
    questionData: GetQuestionExam;
    files?: {
      fileUrl: string;
      fileName: string;
      fileSize: number;
      fileType: string;
    }[];
  }[];
}

const initState: InitialState = {
  examId: "",

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
        questionList: {
          flag: boolean;
          answered: boolean;
          content: string;
          questionData: GetQuestionExam;
          files?: {
            fileUrl: string;
            fileName: string;
            fileSize: number;
            fileType: string;
          }[];
        }[];
      }>
    ) => {
      state.examId = action.payload.examId;
      state.questionList = action.payload.questionList;
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
      action: PayloadAction<{
        id: string;
        fileUrl: string;
        fileName: string;
        fileSize: number;
        fileType: string;
      }>
    ) => {
      const index = state.questionList.findIndex(
        (question) => question.questionData.id === action.payload.id
      );

      if (index !== -1) {
        state.questionList[index].files?.push({
          fileUrl: action.payload.fileUrl,
          fileName: action.payload.fileName,
          fileSize: action.payload.fileSize,
          fileType: action.payload.fileType
        });
        state.questionList[index].answered = true;
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
      if (
        state.questionList[index].files?.length === 0 &&
        (state.questionList[index].content === null ||
          state.questionList[index].content === undefined ||
          state.questionList[index].content === "<p><br></p>" ||
          state.questionList[index].content === "")
      ) {
        state.questionList[index].answered = false;
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
      if (
        state.questionList[index].content === null ||
        state.questionList[index].content === undefined ||
        state.questionList[index].content === "<p><br></p>" ||
        state.questionList[index].content === ""
      )
        state.questionList[index].answered = false;
      return state;
    },
    cleanTakeExamState: (state) => {
      state = initState;

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
  cleanTakeExamState
} = takeExamSlice.actions;

export default takeExamSlice.reducer;
