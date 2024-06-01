import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GetQuestionExam } from "models/courseService/entity/QuestionEntity";

export interface InitialState {
  examId: string;
  questionList: {
    flag: boolean;
    answered: boolean;
    content: string;
    questionData: GetQuestionExam;
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
    setExam: (state, action: PayloadAction<InitialState>) => {
      state = action.payload;
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
    }
  }
});

export const { setExamId, setQuestionList, setFlag, setAnswered, setExam } = takeExamSlice.actions;

export default takeExamSlice.reducer;
