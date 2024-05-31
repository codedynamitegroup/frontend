import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Judge0ResponseEntity } from "models/codeAssessmentService/entity/Judge0ResponseEntity";
interface InitialState {
  result: Judge0ResponseEntity;
  loading: boolean;
}

const initialState: InitialState = {
  loading: false,
  result: {
    stdout: null,
    time: null,
    memory: null,
    stderr: null,
    compile_output: null,
    message: null,
    status: null
  }
};

export const executeResultSlice = createSlice({
  name: "executeResultData",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setResult: (state, action: PayloadAction<Judge0ResponseEntity>) => {
      state.result = action.payload;
    },
    setExecuteResultLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setResult, setExecuteResultLoading } = executeResultSlice.actions;

export default executeResultSlice.reducer;
