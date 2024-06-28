import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Judge0ResponseEntity } from "models/codeAssessmentService/entity/Judge0ResponseEntity";
import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";

// K: questionId, V: CodeQuestionState (data)
export interface TakeExamCodeQuestionInitState {
  codeQuestion: CodeQuestionStateMap;
}

export interface CodeQuestionStateMap {
  [key: string]: CodeQuestionState;
}

export interface CodeQuestionState {
  questionId: string;
  selectedLanguageId: string;
  testCase: TestCaseEntity[];
  result: Judge0ResponseEntity[];
  error: string | null;
  codes: CodeLanaguageMap;
}

// K: languageId, V: Code Language State Data
interface CodeLanaguageMap {
  [key: string]: CodeLanguageStateData;
}

export interface CodeLanguageStateData {
  languageId: string;
  judge0Id: number;
  code: string;
  cpuLimit: number;
  memoryLimit: number;
}

const initState: TakeExamCodeQuestionInitState = {
  codeQuestion: {}
};

const takeExamCodeQuestionSlice = createSlice({
  name: "takeExamCodeQuestion",
  initialState: initState,
  reducers: {
    cleanCodeQuestion: (state) => {
      state.codeQuestion = {};
      return state;
    },
    initCode: (
      state,
      action: PayloadAction<{ questionId: string; codeLanguageDataList: CodeLanguageStateData[] }>
    ) => {
      state.codeQuestion[action.payload.questionId] = {
        questionId: action.payload.questionId,
        selectedLanguageId: action.payload.codeLanguageDataList[0].languageId,
        testCase: [],
        result: [],
        error: null,
        codes: action.payload.codeLanguageDataList.reduce(
          (acc: CodeLanaguageMap, cur: CodeLanguageStateData) => {
            acc[cur.languageId] = cur;
            return acc;
          },
          {}
        )
      };

      return state;
    },
    setCode: (
      state,
      action: PayloadAction<{ questionId: string; languageId: string; code: string }>
    ) => {
      state.codeQuestion[action.payload.questionId].codes[action.payload.languageId].code =
        action.payload.code;
      return state;
    },
    setSelectedLanguageId: (
      state,
      action: PayloadAction<{ questionId: string; selectedLanguageId: string }>
    ) => {
      state.codeQuestion[action.payload.questionId].selectedLanguageId =
        action.payload.selectedLanguageId;
      return state;
    },
    addTestCase: (
      state,
      action: PayloadAction<{
        questionId: string;
      }>
    ) => {
      const tempTestCase = {
        inputData: "",
        outputData: "",
        id: "sampleid",
        isSample: true
      };

      if (!state.codeQuestion[action.payload.questionId].testCase) {
        state.codeQuestion[action.payload.questionId].testCase = [];
      }

      state.codeQuestion[action.payload.questionId].testCase?.push(tempTestCase);
      return state;
    },
    setInputData: (
      state,
      action: PayloadAction<{ questionId: string; index: number; value: string }>
    ) => {
      state.codeQuestion[action.payload.questionId].testCase[action.payload.index].inputData =
        action.payload.value;
      return state;
    },
    setOutputData(
      state,
      action: PayloadAction<{ questionId: string; index: number; value: string }>
    ) {
      state.codeQuestion[action.payload.questionId].testCase[action.payload.index].outputData =
        action.payload.value;
      return state;
    },
    deleteTestCase(state, action: PayloadAction<{ questionId: string; index: number }>) {
      state.codeQuestion[action.payload.questionId].testCase?.splice(action.payload.index, 1);
      return state;
    },
    cleanResult(state, action: PayloadAction<{ questionId: string }>) {
      state.codeQuestion[action.payload.questionId].result = [];
      return state;
    },
    setCodeQuestionExamResult(
      state,
      action: PayloadAction<{
        questionId: string;
        result: Judge0ResponseEntity[];
      }>
    ) {
      state.codeQuestion[action.payload.questionId].error = null;
      state.codeQuestion[action.payload.questionId].result = action.payload.result;
      return state;
    },
    setCodeQuestionExamResultError(
      state,
      action: PayloadAction<{
        questionId: string;
        error: string;
      }>
    ) {
      state.codeQuestion[action.payload.questionId].result = [];
      state.codeQuestion[action.payload.questionId].error = action.payload.error;
      return state;
    },
    setSampleTestCase(
      state,
      action: PayloadAction<{ questionId: string; sampleTestCases: TestCaseEntity[] }>
    ) {
      state.codeQuestion[action.payload.questionId].testCase = action.payload.sampleTestCases;
      return state;
    }
  }
});

export const {
  setCode,
  setSelectedLanguageId,
  initCode,
  addTestCase,
  setInputData,
  setOutputData,
  deleteTestCase,
  cleanCodeQuestion,
  cleanResult,
  setCodeQuestionExamResult,
  setCodeQuestionExamResultError,
  setSampleTestCase
} = takeExamCodeQuestionSlice.actions;
export default takeExamCodeQuestionSlice.reducer;
