import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  isOpen: boolean;
}

const initialState: InitialState = {
  isOpen: true
};

const sidebarStatusSlice = createSlice({
  name: "sidebarStatus",
  initialState: initialState,
  reducers: {
    toggleSidebar: (state: InitialState) => {
      state.isOpen = !state.isOpen;
    }
  }
});

export const { toggleSidebar } = sidebarStatusSlice.actions;
export default sidebarStatusSlice.reducer;
