import { createSlice } from "@reduxjs/toolkit";
import { QuestionEntity } from "models/coreService/entity/QuestionEntity";

interface InitialState {
  questionCreate: QuestionEntity[];
}

const initState: InitialState = {
  questionCreate: []
};

const questionCreateSlice = createSlice({
  name: "questionId",
  initialState: initState,
  reducers: {
    setQuestionCreate: (state, action) => {
      state.questionCreate.push(action.payload);
    },
    clearQuestionCreate: (state) => {
      state.questionCreate = [];
    },
    setQuestionCreateFromBank(state, action: { payload: QuestionEntity[] }) {
      state.questionCreate.push(...action.payload);
    }
  }
});

export const { setQuestionCreate, clearQuestionCreate, setQuestionCreateFromBank } =
  questionCreateSlice.actions;

export default questionCreateSlice.reducer;
