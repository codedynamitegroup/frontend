import { createSlice } from "@reduxjs/toolkit";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";

interface InitialState {
  isLoading: boolean;
  mostEnrolledCertificateCourses: CertificateCourseEntity[];
  certificateCourses: CertificateCourseEntity[];
  certificateCourseDetails: CertificateCourseEntity | null;
}

const initState: InitialState = {
  isLoading: false,
  mostEnrolledCertificateCourses: [],
  certificateCourses: [],
  certificateCourseDetails: null
};

const certificateCourseSlice = createSlice({
  name: "certificateCourse",
  initialState: initState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setCertificateCourses: (state, action) => {
      state.certificateCourses = action.payload;
    },
    setMostEnrolledCertificateCourses: (state, action) => {
      state.mostEnrolledCertificateCourses = action.payload;
    },
    setCertificateCourseDetails: (state, action) => {
      state.certificateCourseDetails = action.payload;
    }
  }
});

export const {
  setLoading,
  setCertificateCourses,
  setCertificateCourseDetails,
  setMostEnrolledCertificateCourses
} = certificateCourseSlice.actions;

export default certificateCourseSlice.reducer;
