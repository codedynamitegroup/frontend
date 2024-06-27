import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
  codes: CodeLanaguageMap;
}

// K: languageId, V: code
interface CodeLanaguageMap {
  [key: string]: string;
}

const initState: TakeExamCodeQuestionInitState = {
  codeQuestion: {}
};

const takeExamCodeQuestionSlice = createSlice({
  name: "takeExamCodeQuestion",
  initialState: initState,
  reducers: {
    initCode: (state, action: PayloadAction<{ questionId: string; languageIdList: string[] }>) => {
      state.codeQuestion[action.payload.questionId] = {
        questionId: action.payload.questionId,
        selectedLanguageId: action.payload.languageIdList[0],
        codes: action.payload.languageIdList.reduce((acc: CodeLanaguageMap, cur: string) => {
          acc[cur] = "";
          return acc;
        }, {})
      };

      return state;
    },
    setCode: (
      state,
      action: PayloadAction<{ questionId: string; languageId: string; code: string }>
    ) => {
      state.codeQuestion[action.payload.questionId].codes[action.payload.languageId] =
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
    }
  }
});

export const { setCode, setSelectedLanguageId, initCode } = takeExamCodeQuestionSlice.actions;
export default takeExamCodeQuestionSlice.reducer;
