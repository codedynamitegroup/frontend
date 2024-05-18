import { createSlice } from "@reduxjs/toolkit";
import { ChapterEntity } from "models/coreService/entity/ChapterEntity";

interface InitialState {
  isLoading: boolean;
  chapters: ChapterEntity[];
}

const initState: InitialState = {
  isLoading: false,
  chapters: []
};

const chapterSlice = createSlice({
  name: "chapter",
  initialState: initState,
  reducers: {
    setChapters: (state, action) => {
      state.chapters = action.payload.chapters;
    }
  }
});

export const { setChapters } = chapterSlice.actions;

export default chapterSlice.reducer;
