import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { User } from "models/authService/entity/user";

interface InitialState {
  currentUser: User | null;
  isLoggedIn: Boolean;
}

const initialState: InitialState = {
  currentUser: null,
  isLoggedIn: false
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLogin: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload.user;
      state.isLoggedIn = true;
    },
    logOut: (state) => {
      state.currentUser = null;
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
export const selectLoginStatus = (state: any) => state.auth.isLoggedIn;
