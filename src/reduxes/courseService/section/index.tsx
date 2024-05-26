import { createSlice } from "@reduxjs/toolkit";
import { SectionEntity } from "models/courseService/entity/SectionEntity";

interface InitialState {
  isLoading: boolean;
  sections: SectionEntity[];
}

const initialState: InitialState = {
  isLoading: false,
  sections: []
};

const sectionSlice = createSlice({
  name: "section",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setSections: (state, action) => {
      state.sections = action.payload.sections;
    }
  }
});

export const { setLoading, setSections } = sectionSlice.actions;

export default sectionSlice.reducer;
