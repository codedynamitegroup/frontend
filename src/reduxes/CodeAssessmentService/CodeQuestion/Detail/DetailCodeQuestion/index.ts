import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";

interface InitialState {
  codeQuestion: CodeQuestionEntity | null;
}

const initialState: InitialState = {
  codeQuestion: null
};

export const detailCodeQuestionSlice = createSlice({
  name: "detailCodeQuestion",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCodeQuestion: (state, action: PayloadAction<CodeQuestionEntity>) => {
      state.codeQuestion = action.payload;
    }
  }
});

export const { setCodeQuestion } = detailCodeQuestionSlice.actions;

export default detailCodeQuestionSlice.reducer;
