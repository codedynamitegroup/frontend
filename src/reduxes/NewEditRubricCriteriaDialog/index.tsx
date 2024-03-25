import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  newCriteriaStatus: boolean;
  editCriteriaStatus: boolean;
}

const initState: InitialState = {
  newCriteriaStatus: false,
  editCriteriaStatus: false
};

const rubricCriteriaConfigDialogSlice = createSlice({
  name: "rubricCriteriaConfigDialo",
  initialState: initState,
  reducers: {
    openNewCriteria: (state) => {
      state.newCriteriaStatus = true;
    },
    closeNewCriteria: (state) => {
      state.newCriteriaStatus = false;
    },
    openEditCriteria: (state) => {
      state.editCriteriaStatus = true;
    },
    closeEditCriteria: (state) => {
      state.editCriteriaStatus = false;
    }
  }
});

export const { openNewCriteria, openEditCriteria, closeNewCriteria, closeEditCriteria } =
  rubricCriteriaConfigDialogSlice.actions;

export default rubricCriteriaConfigDialogSlice.reducer;
