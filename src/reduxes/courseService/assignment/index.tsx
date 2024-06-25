import { createSlice } from "@reduxjs/toolkit";
import { AssignmentEntity } from "models/courseService/entity/AssignmentEntity";
import { ListSubmissionResponseEntity } from "models/courseService/entity/custom/ListSubmissionResponseEntity";

interface InitialState {
  courseId: string | null;
  assignments: AssignmentEntity[];
  assignmentDetails: AssignmentEntity | null;
  listSubmission: ListSubmissionResponseEntity | null;
}

const initialState: InitialState = {
  courseId: null,
  assignments: [],
  assignmentDetails: null,
  listSubmission: null
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState: initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload.assignments;
      state.courseId = action.payload.courseId;
    },
    setAssignmentDetails: (state, action) => {
      state.assignmentDetails = action.payload;
    },
    setListSubmission: (state, action) => {
      state.listSubmission = action.payload;
    }
  }
});

export const { setAssignments, setAssignmentDetails, setListSubmission } = assignmentSlice.actions;

export default assignmentSlice.reducer;
