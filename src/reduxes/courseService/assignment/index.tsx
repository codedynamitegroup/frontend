import { createSlice } from "@reduxjs/toolkit";
import { AssignmentEntity } from "models/courseService/entity/AssignmentEntity";

interface InitialState {
  isLoading: boolean;
  assignments: AssignmentEntity[];
  assignmentDetails: AssignmentEntity | null;
}

const initialState: InitialState = {
  isLoading: false,
  assignments: [],
  assignmentDetails: null
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setAssignments: (state, action) => {
      state.assignments = action.payload.assignments;
    },
    setAssignmentDetails: (state, action) => {
      state.assignmentDetails = action.payload;
    }
  }
});

export const { setLoading, setAssignments, setAssignmentDetails } = assignmentSlice.actions;

export default assignmentSlice.reducer;
