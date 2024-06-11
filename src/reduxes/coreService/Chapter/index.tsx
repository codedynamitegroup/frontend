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
    },
    markChapterResourceAsViewed: (state, action) => {
      const chapterIndex = state.chapters.findIndex(
        (chapter) => chapter.chapterId === action.payload.chapterId
      );
      const lessonIndex = state.chapters[chapterIndex].resources.findIndex(
        (lesson) => lesson.chapterResourceId === action.payload.lessonId
      );
      if (
        chapterIndex !== -1 &&
        lessonIndex !== -1 &&
        state.chapters[chapterIndex].resources[lessonIndex].isCompleted !== true
      ) {
        state.chapters[chapterIndex].resources[lessonIndex].isCompleted = true;
      }
    }
  }
});

export const { setChapters, markChapterResourceAsViewed } = chapterSlice.actions;

export default chapterSlice.reducer;
