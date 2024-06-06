import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  loading: boolean;
  isLoadingAuth: boolean;
}

const initState: InitialState = {
  loading: false,
  isLoadingAuth: false
};

const loadingSlice = createSlice({
  name: "loading",
  initialState: initState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setLoadingAuth: (state, action: PayloadAction<boolean>) => {
      state.isLoadingAuth = action.payload;
    }
  }
});

export const { setLoading, setLoadingAuth } = loadingSlice.actions;

export default loadingSlice.reducer;

export const selectedLoading = (state: any) => state.loading.loading;
export const selectedIsLoadingAuth = (state: any) => state.loading.isLoadingAuth;
