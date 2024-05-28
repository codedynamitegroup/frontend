import { createSlice } from "@reduxjs/toolkit";
import { SubmissionAssignmentEntity } from "models/courseService/entity/SubmissionAssignmentEntity";

interface InitialState {
  isLoading: boolean;
  submissionAssignments: SubmissionAssignmentEntity[];
  submissionAssignmentDetails: SubmissionAssignmentEntity | null;
}

const initialState: InitialState = {
  isLoading: false,
  submissionAssignments: [],
  submissionAssignmentDetails: null
};

const submissionAssignmentSlice = createSlice({
  name: "submissionAssignment",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setSubmissionAssignments: (state, action) => {
      state.submissionAssignments = action.payload.submissionAssignments;
    },
    setSubmissionAssignmentDetails: (state, action) => {
      state.submissionAssignmentDetails = action.payload;
    }
  }
});

export const { setLoading, setSubmissionAssignments, setSubmissionAssignmentDetails } =
  submissionAssignmentSlice.actions;

export default submissionAssignmentSlice.reducer;
