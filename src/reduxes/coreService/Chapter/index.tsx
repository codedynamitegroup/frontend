import { createSlice } from "@reduxjs/toolkit";
import { ChapterEntity } from "models/coreService/entity/ChapterEntity";
import { ResourceTypeEnum } from "models/coreService/enum/ResourceTypeEnum";

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
      let chapterIndex = -1;
      let lessonIndex = -1;

      for (let i = 0; i < state.chapters.length; i++) {
        for (let j = 0; j < state.chapters[i].resources.length; j++) {
          if (state.chapters[i].resources[j].chapterResourceId === action.payload.lessonId) {
            chapterIndex = i;
            lessonIndex = j;
            break;
          }
        }
      }

      if (
        chapterIndex !== -1 &&
        lessonIndex !== -1 &&
        state.chapters[chapterIndex].resources[lessonIndex].isCompleted !== true &&
        state.chapters[chapterIndex].resources[lessonIndex].resourceType !== ResourceTypeEnum.CODE
      ) {
        state.chapters[chapterIndex].resources[lessonIndex].isCompleted = true;
      }
    }
  }
});

export const { setChapters, markChapterResourceAsViewed } = chapterSlice.actions;

export default chapterSlice.reducer;
