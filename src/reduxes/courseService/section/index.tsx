import { createSlice } from "@reduxjs/toolkit";
import { SectionEntity } from "models/courseService/entity/SectionEntity";

interface InitialState {
  isLoading: boolean;
  sections: SectionEntity[];
  courseId: string | null;
}

const initialState: InitialState = {
  isLoading: false,
  sections: [],
  courseId: null
};

const sectionSlice = createSlice({
  name: "section",
  initialState: initialState,
  reducers: {
    setLoadingSections: (state, action) => {
      state.isLoading = action.payload;
    },
    setSections: (state, action) => {
      state.sections = action.payload.sections;
      state.courseId = action.payload.courseId;
    },
    clearSections: (state) => {
      state.sections = [];
      state.courseId = null;
    }
  }
});

export const { setLoadingSections, setSections, clearSections } = sectionSlice.actions;

export default sectionSlice.reducer;
