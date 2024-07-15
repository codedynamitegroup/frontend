import { createSlice } from "@reduxjs/toolkit";
import { PostEntity } from "models/courseService/entity/PostEntity";
import { PaginationList } from "models/general";

interface InitialState {
  isLoading: boolean;
  posts: PaginationList<PostEntity>;
  courseId: string | null;
}

const initialState: InitialState = {
  isLoading: false,
  posts: { currentPage: 0, totalItems: 0, totalPages: 0, items: [] },
  courseId: null
};

const postSlice = createSlice({
  name: "post",
  initialState: initialState,
  reducers: {
    setLoadingPosts: (state, action) => {
      state.isLoading = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
      state.courseId = action.payload.courseId;
    },
    clearPosts: (state) => {
      state.posts = { currentPage: 0, totalItems: 0, totalPages: 0, items: [] };
      state.courseId = null;
    }
  }
});

export const { setLoadingPosts, setPosts, clearPosts } = postSlice.actions;

export default postSlice.reducer;
