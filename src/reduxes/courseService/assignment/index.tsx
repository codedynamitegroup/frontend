import { createSlice } from "@reduxjs/toolkit";
import { AssignmentEntity } from "models/courseService/entity/AssignmentEntity";
import { ListSubmissionResponseEntity } from "models/courseService/entity/custom/ListSubmissionResponseEntity";

interface InitialState {
  isLoading: boolean;
  assignments: AssignmentEntity[];
  assignmentDetails: AssignmentEntity | null;
  listSubmission: ListSubmissionResponseEntity | null;
}

const initialState: InitialState = {
  isLoading: false,
  assignments: [],
  assignmentDetails: null,
  listSubmission: null
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
    },
    setListSubmission: (state, action) => {
      state.listSubmission = action.payload;
    }
  }
});

export const { setLoading, setAssignments, setAssignmentDetails, setListSubmission } =
  assignmentSlice.actions;

export default assignmentSlice.reducer;
