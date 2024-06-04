import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UUID } from "crypto";
interface InitialState {
  language_id: number | undefined;
  stdin: string | undefined;
  expected_output: string | undefined;
  cpu_time_limit: number | undefined;
  memory_limit: number | undefined;
  source_code: string | undefined;
  head_code: string | undefined;
  body_code: string | undefined;
  tail_code: string | undefined;
  system_language_id: UUID | undefined;
}

const initialState: InitialState = {
  language_id: undefined,
  source_code: undefined,
  stdin: undefined,
  expected_output: undefined,
  cpu_time_limit: undefined,
  memory_limit: undefined,
  system_language_id: undefined,
  head_code: undefined,
  body_code: undefined,
  tail_code: undefined
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
    },
    setSystemLanguageId: (state, action: PayloadAction<UUID | undefined>) => {
      state.system_language_id = action.payload;
    },
    setHeadBodyTailCode: (
      state,
      action: PayloadAction<{
        headCode: string | undefined;
        bodyCode: string | undefined;
        tailCode: string | undefined;
      }>
    ) => {
      state.head_code = action.payload.headCode;
      state.body_code = action.payload.bodyCode;
      state.tail_code = action.payload.tailCode;
    }
  }
});

export const {
  setLanguageId,
  setSourceCode,
  setStdin,
  setCpuTimeLimit,
  setExpectedOutput,
  setMemoryLimit,
  setSystemLanguageId,
  setHeadBodyTailCode
} = executeSlice.actions;

export default executeSlice.reducer;
