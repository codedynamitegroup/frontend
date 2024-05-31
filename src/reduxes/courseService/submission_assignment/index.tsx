import { createSlice } from "@reduxjs/toolkit";
import { SubmissionAssignmentEntity } from "models/courseService/entity/SubmissionAssignmentEntity";

interface InitialState {
  isLoading: boolean;
  submissionAssignments: SubmissionAssignmentEntity[];
  submissionAssignmentDetails: SubmissionAssignmentEntity | null;
  amountSubmissionToGrade: number;
  amountSubmission: number;
}

const initialState: InitialState = {
  isLoading: false,
  submissionAssignments: [],
  submissionAssignmentDetails: null,
  amountSubmissionToGrade: 0,
  amountSubmission: 0
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
    },
    setAmountSubmissionToGrade: (state, action) => {
      state.amountSubmissionToGrade = action.payload.amountSubmissionToGrade;
    },
    setAmountSubmission: (state, action) => {
      state.amountSubmission = action.payload.amountSubmission;
    }
  }
});

export const {
  setLoading,
  setSubmissionAssignments,
  setSubmissionAssignmentDetails,
  setAmountSubmissionToGrade,
  setAmountSubmission
} = submissionAssignmentSlice.actions;

export default submissionAssignmentSlice.reducer;
