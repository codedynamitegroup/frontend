import { createSlice } from "@reduxjs/toolkit";
import { CertificateCourseEntity } from "models/coreService/entity/CertificateCourseEntity";

interface InitialState {
  isLoading: boolean;
  certificateCourses: {
    certificateCourses: CertificateCourseEntity[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
}

const initialState: InitialState = {
  isLoading: false,
  certificateCourses: {
    certificateCourses: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  }
};

const certificateCourseSlice = createSlice({
  name: "adminCertificateCourse",
  initialState: initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload.isLoading;
    },
    setAdminCertificateCourses: (state, action) => {
      state.certificateCourses.certificateCourses = action.payload.certificateCourses;
      state.certificateCourses.currentPage = action.payload.currentPage;
      state.certificateCourses.totalItems = action.payload.totalItems;
      state.certificateCourses.totalPages = action.payload.totalPages;
    },
    clearAdminCertificateCourses: (state) => {
      state.certificateCourses.certificateCourses = [];
      state.certificateCourses.currentPage = 0;
      state.certificateCourses.totalItems = 0;
      state.certificateCourses.totalPages = 0;
    }
  }
});

export const { setLoading, setAdminCertificateCourses, clearAdminCertificateCourses } =
  certificateCourseSlice.actions;
export default certificateCourseSlice.reducer;
