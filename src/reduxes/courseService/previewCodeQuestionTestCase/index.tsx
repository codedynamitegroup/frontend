import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";

interface InitialState {
  testCases: TestCaseEntity[];
}

const initialState: InitialState = {
  testCases: []
};

export const previewCodeQuestionTestCaseSlice = createSlice({
  name: "previewCodeQuestionTestCase",
  initialState,
  reducers: {
    setTestCases: (state, action: PayloadAction<TestCaseEntity[]>) => {
      state.testCases = action.payload;
    }
  }
});

export const { setTestCases } = previewCodeQuestionTestCaseSlice.actions;
export default previewCodeQuestionTestCaseSlice.reducer;
