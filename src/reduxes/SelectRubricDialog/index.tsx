import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  status: boolean;
  selectedList: any[];
}

const initState: InitialState = {
  status: false,
  selectedList: []
};

const selectRubricDialogSlice = createSlice({
  name: "selectRubricDialog",
  initialState: initState,
  reducers: {
    open: (state) => {
      state.status = true;
    },
    close: (state) => {
      state.status = false;
    },
    setSelectedList: (state, action: PayloadAction<any[]>) => {
      state.selectedList = action.payload;
    }
  }
});

export const { open, close } = selectRubricDialogSlice.actions;

export default selectRubricDialogSlice.reducer;
