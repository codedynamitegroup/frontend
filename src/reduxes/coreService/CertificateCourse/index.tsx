import { createSlice } from "@reduxjs/toolkit";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";

interface InitialState {
  isLoading: boolean;
  mostEnrolledCertificateCourses: CertificateCourseEntity[];
  certificateCourses: CertificateCourseEntity[];
}

const initState: InitialState = {
  isLoading: false,
  mostEnrolledCertificateCourses: [],
  certificateCourses: []
};

const certificateCourseSlice = createSlice({
  name: "certificateCourse",
  initialState: initState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setCertificateCourses: (state, action) => {
      state.certificateCourses = action.payload.certificateCourses;
      state.mostEnrolledCertificateCourses = action.payload.mostEnrolledCertificateCourses;
    }
  }
});

export const { setLoading, setCertificateCourses } = certificateCourseSlice.actions;

export default certificateCourseSlice.reducer;
