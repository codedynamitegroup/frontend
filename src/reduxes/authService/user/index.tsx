import { createSlice } from "@reduxjs/toolkit";
import { User } from "models/authService/entity/user";

interface InitialState {
  isLoading: boolean;
  users: {
    users: User[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: InitialState = {
  isLoading: false,
  users: {
    users: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  }
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setUsers: (state, action) => {
      state.users.users = action.payload.users;
      state.users.currentPage = action.payload.currentPage;
      state.users.totalItems = action.payload.totalItems;
      state.users.totalPages = action.payload.totalPages;
    },
    clearUsers: (state) => {
      state.users.users = [];
      state.users.currentPage = 0;
      state.users.totalItems = 0;
      state.users.totalPages = 0;
    }
  }
});

export const { setLoading, setUsers, clearUsers } = userSlice.actions;

export default userSlice.reducer;
