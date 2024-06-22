import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  editMode: boolean;
}

const initState: InitialState = {
  editMode: false
};

const editModeSlice = createSlice({
  name: "editMode",
  initialState: initState,
  reducers: {
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
    }
  }
});

export const { setEditMode } = editModeSlice.actions;
export default editModeSlice.reducer;
