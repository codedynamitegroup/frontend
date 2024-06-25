import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  isOpen: boolean;
  headerHeight: number;
  sidebarWidth: number;
}

const initialState: InitialState = {
  isOpen: true,
  headerHeight: 0,
  sidebarWidth: 0
};

const sidebarStatusSlice = createSlice({
  name: "sidebarStatus",
  initialState: initialState,
  reducers: {
    toggleSidebar: (state: InitialState) => {
      state.isOpen = !state.isOpen;
    },
    setHeaderHeight: (state: InitialState, action: PayloadAction<number>) => {
      state.headerHeight = action.payload;
    },
    setSidebarWidth: (state: InitialState, action: PayloadAction<number>) => {
      state.sidebarWidth = action.payload;
    }
  }
});

export const { toggleSidebar, setHeaderHeight, setSidebarWidth } = sidebarStatusSlice.actions;
export default sidebarStatusSlice.reducer;
