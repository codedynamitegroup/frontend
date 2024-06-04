import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "models/authService/entity/user";

export enum EFetchingUser {
  FAILED = "FAILED",
  SUCCESS = "SUCCESS",
  PENDING = "PENDING"
}
interface InitialState {
  currentUser: User | null;
  isLoggedIn: Boolean;
  isFetching: EFetchingUser | null;
}

const initialState: InitialState = {
  currentUser: null,
  isLoggedIn: false,
  isFetching: null
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload.user;
      state.isLoggedIn = true;
      state.isFetching = EFetchingUser.SUCCESS;
    },
    logOut: (state) => {
      state.currentUser = null;
      state.isLoggedIn = false;
      state.isFetching = null;
    },
    loginStatus: (state, action: PayloadAction<Boolean>) => {
      state.isLoggedIn = action.payload;
    },
    fetchStatus: (state, action: PayloadAction<EFetchingUser>) => {
      state.isFetching = action.payload;
    }
  }
});

export const { setLogin, logOut, loginStatus, fetchStatus } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.currentUser;
export const selectLoginStatus = (state: any) => state.auth.isLoggedIn;
export const selectFetchingStatus = (state: any) => state.auth.isFetching;
