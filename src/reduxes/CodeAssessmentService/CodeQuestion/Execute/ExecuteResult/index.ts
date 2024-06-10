import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Judge0ResponseEntity } from "models/codeAssessmentService/entity/Judge0ResponseEntity";
interface InitialState {
  result: Judge0ResponseEntity[];
  loading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  loading: false,
  result: [],
  error: null
};

export const executeResultSlice = createSlice({
  name: "executeResultData",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setResult: (state, action: PayloadAction<Judge0ResponseEntity[]>) => {
      state.result = action.payload;
    },
    setExecuteResultLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setExecuteError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  }
});

export const { setResult, setExecuteResultLoading, setExecuteError } = executeResultSlice.actions;

export default executeResultSlice.reducer;
