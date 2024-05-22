import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "models/authService/entity/user";
import { ESocialLoginProvider } from "models/authService/enum/ESocialLoginProvider";

interface InitialState {
  currentUser: User | null;
  token: string | null;
  isLoggedIn: Boolean;
  provider: ESocialLoginProvider | null;
}

const initialState: InitialState = {
  currentUser: null,
  token: null,
  isLoggedIn: false,
  provider: null
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.provider = action.payload.provider;
    },
    logOut: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isLoggedIn = false;
    },
    loginStatus: (state, action: PayloadAction<Boolean>) => {
      state.isLoggedIn = action.payload;
    }
  }
});

export const { setLogin, logOut, loginStatus } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.currentUser;
export const selectToken = (state: any) => state.auth.token;
export const selectLoginStatus = (state: any) => state.auth.isLoggedIn;
export const selectProvider = (state: any) => state.auth.provider;
