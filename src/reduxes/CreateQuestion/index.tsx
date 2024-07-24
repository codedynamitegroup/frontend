import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EQType } from "pages/client/lecturer/QuestionManagement/components/AICreateQuestion";
import { IQuestion } from "services/AIService/CreateQuestionByAI";

interface Question extends IQuestion {
  tempId: string;
  qType: EQType;
  categoryName?: string;
}

export interface CreateQuestionInitState {
  questions: Question[];
}

const initialState: CreateQuestionInitState = {
  questions: []
};

const createQuestionSlice = createSlice({
  name: "createQuestion",
  initialState: initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((question) => question.tempId !== action.payload);
    }
  }
});

export const { addQuestion, removeQuestion } = createQuestionSlice.actions;
export default createQuestionSlice.reducer;
