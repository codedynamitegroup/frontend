import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  error?: string;
  success?: string;
}

const initState: InitialState = {};

const appStatusSlice = createSlice({
  name: "appStatus",
  initialState: initState,
  reducers: {
    setSuccessMess: (state, action: PayloadAction<string>) => {
      state.success = action.payload;
    },
    setErrorMess: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearErrorMess: (state, action: PayloadAction<any>) => {
      state.error = undefined;
    },
    clearSuccessMess: (state, action: PayloadAction<any>) => {
      state.success = undefined;
    }
  }
});

export const { setSuccessMess, setErrorMess, clearErrorMess, clearSuccessMess } =
  appStatusSlice.actions;

export default appStatusSlice.reducer;

export const selectStateSnackbar = (state: any) => state.appStatus;
