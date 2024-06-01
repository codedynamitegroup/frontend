import { createSlice } from "@reduxjs/toolkit";
import { CourseTypeEntity } from "models/courseService/entity/CourseTypeEntity";

interface InitialState {
  isLoading: boolean;
  courseTypes: CourseTypeEntity[];
}

const initialState: InitialState = {
  isLoading: false,
  courseTypes: []
};

const courseTypeSlice = createSlice({
  name: "courseType",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setCourseTypes: (state, action) => {
      state.courseTypes = action.payload.courseTypes;
    }
  }
});

export const { setLoading, setCourseTypes } = courseTypeSlice.actions;

export default courseTypeSlice.reducer;
