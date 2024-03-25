import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  status: boolean;
}

const initState: InitialState = {
  status: false
};

const selectCriteriaDialogSlice = createSlice({
  name: "selectCriteriaDialog",
  initialState: initState,
  reducers: {
    open: (state) => {
      state.status = true;
    },
    close: (state) => {
      state.status = false;
    }
  }
});

export const { open, close } = selectCriteriaDialogSlice.actions;

export default selectCriteriaDialogSlice.reducer;
