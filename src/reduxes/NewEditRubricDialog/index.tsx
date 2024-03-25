import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  newRubricStatus: boolean;
  editRubricStatus: boolean;
}

const initState: InitialState = {
  newRubricStatus: false,
  editRubricStatus: false
};

const rubricDialogSlice = createSlice({
  name: "rubricConfigDialog",
  initialState: initState,
  reducers: {
    openNewRubric: (state) => {
      state.newRubricStatus = true;
    },
    closeNewRubric: (state) => {
      state.newRubricStatus = false;
    },
    openEditRubric: (state) => {
      state.editRubricStatus = true;
    },
    closeEditRubric: (state) => {
      state.editRubricStatus = false;
    }
  }
});

export const { openNewRubric, closeNewRubric, openEditRubric, closeEditRubric } =
  rubricDialogSlice.actions;

export default rubricDialogSlice.reducer;
