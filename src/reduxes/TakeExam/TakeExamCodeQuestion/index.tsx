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
  codes: CodeLanaguageMap;
}

// K: languageId, V: Code Language State Data
interface CodeLanaguageMap {
  [key: string]: CodeLanguageStateData;
}

export interface CodeLanguageStateData {
  languageId: string;
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
    initCode: (
      state,
      action: PayloadAction<{ questionId: string; codeLanguageDataList: CodeLanguageStateData[] }>
    ) => {
      state.codeQuestion[action.payload.questionId] = {
        questionId: action.payload.questionId,
        selectedLanguageId: action.payload.codeLanguageDataList[0].languageId,
        testCase: [],
        result: [],
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
  deleteTestCase
} = takeExamCodeQuestionSlice.actions;
export default takeExamCodeQuestionSlice.reducer;
