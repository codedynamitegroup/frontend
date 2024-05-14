import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ChapterEntity } from "models/coreService/entity/ChapterEntity";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

interface InitialState {
  isLoading: boolean;
  chapters: ChapterEntity[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

const initState: InitialState = {
  isLoading: false,
  chapters: [],
  currentPage: 0,
  totalItems: 0,
  totalPages: 0
};

export const fetchAllChapters = createAsyncThunk(
  "chapters/fetchAll",
  async (
    data: {
      certificateCourseId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${coreServiceApiUrl}chapters`, {
        params: {
          certificateCourseId: data.certificateCourseId
        }
      });
      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch chapters", error);
      return rejectWithValue(error);
    }
  }
);

const chapterSlice = createSlice({
  name: "chapter",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllChapters.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllChapters.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chapters = action.payload.chapters;
      state.currentPage = action.payload.currentPage;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchAllChapters.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const {} = chapterSlice.actions;

export default chapterSlice.reducer;
