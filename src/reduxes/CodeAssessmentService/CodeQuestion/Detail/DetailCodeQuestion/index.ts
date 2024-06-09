import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { index } from "d3";
import { CodeQuestionEntity } from "models/codeAssessmentService/entity/CodeQuestionEntity";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";
import { ProgrammingLanguageEntity } from "models/coreService/entity/ProgrammingLanguageEntity";

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
    },
    setProgrammingLanguages: (state, action: PayloadAction<ProgrammingLanguageEntity[]>) => {
      if (state.codeQuestion !== null) state.codeQuestion.languages = action.payload;
    },
    setSampleTestCases: (state, action: PayloadAction<TestCaseEntity[]>) => {
      if (state.codeQuestion !== null) state.codeQuestion.sampleTestCases = action.payload;
    }
  }
});

export const { setCodeQuestion, setProgrammingLanguages, setSampleTestCases } =
  detailCodeQuestionSlice.actions;

export default detailCodeQuestionSlice.reducer;
