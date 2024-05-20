import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  loading: boolean;
}

const initState: InitialState = {
  loading: false
};

const loadingSlice = createSlice({
  name: "loading",
  initialState: initState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;

export const selectedLoading = (state: any) => state.loading.loading;
