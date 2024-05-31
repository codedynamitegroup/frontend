import { PayloadAction, createSlice } from "@reduxjs/toolkit";
interface InitialState {
  language_id: number | undefined;
  stdin: string | undefined;
  expected_output: string | undefined;
  cpu_time_limit: number | undefined;
  memory_limit: number | undefined;
  source_code: string | undefined;
}

const initialState: InitialState = {
  language_id: undefined,
  source_code: undefined,
  stdin: undefined,
  expected_output: undefined,
  cpu_time_limit: undefined,
  memory_limit: undefined
};

export const executeSlice = createSlice({
  name: "executeData",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLanguageId: (state, action: PayloadAction<number | undefined>) => {
      state.language_id = action.payload;
    },
    setSourceCode: (state, action: PayloadAction<string | undefined>) => {
      state.source_code = action.payload;
    },
    setStdin: (state, action: PayloadAction<string | undefined>) => {
      state.stdin = action.payload;
    },
    setCpuTimeLimit: (state, action: PayloadAction<number | undefined>) => {
      state.cpu_time_limit = action.payload;
    },
    setMemoryLimit: (state, action: PayloadAction<number | undefined>) => {
      state.memory_limit = action.payload;
    },
    setExpectedOutput: (state, action: PayloadAction<string | undefined>) => {
      state.expected_output = action.payload;
    }
  }
});

export const {
  setLanguageId,
  setSourceCode,
  setStdin,
  setCpuTimeLimit,
  setExpectedOutput,
  setMemoryLimit
} = executeSlice.actions;

export default executeSlice.reducer;
