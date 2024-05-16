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

// export const fetchAllCertificateCourses = createAsyncThunk(
//   "certificateCourses/fetchAll",
//   async (
//     data: {
//       courseName: string;
//       filterTopicIds: string[];
//       isRegisteredFilter: IsRegisteredFilterEnum;
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       return CertificateCourseService.getCertificateCourses({
//         courseName: data.courseName,
//         filterTopicIds: data.filterTopicIds,
//         isRegisteredFilter: data.isRegisteredFilter
//       });
//     } catch (error: any) {
//       console.error("Failed to fetch certificate courses", error);
//       return rejectWithValue({
//         code: error.response?.code || 503,
//         status: error.response?.status || "Service Unavailable",
//         message: error.response?.message || error.message
//       });
//     }
//   }
// );

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
  // extraReducers: (builder) => {
  //   builder.addCase(fetchAllCertificateCourses.pending, (state) => {
  //     state.isLoading = true;
  //   });
  //   builder.addCase(fetchAllCertificateCourses.fulfilled, (state, action) => {
  //     state.isLoading = false;
  //     state.certificateCourses = action.payload.certificateCourses;
  //     state.mostEnrolledCertificateCourses = action.payload.mostEnrolledCertificateCourses;
  //   });
  //   builder.addCase(fetchAllCertificateCourses.rejected, (state) => {
  //     state.isLoading = false;
  //   });
  // }
});

export const { setLoading, setCertificateCourses } = certificateCourseSlice.actions;

export default certificateCourseSlice.reducer;
