import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";
import { UUID } from "node:crypto";

// Define a type for the slice state
interface InitialState {
  isLoading: boolean;
  filter: TagEntity[];
  tagList: TagEntity[];
}

// Define the initial state using that type
const initialState: InitialState = {
  isLoading: false,
  tagList: [],
  filter: []
};

export const algorithmTagSlice = createSlice({
  name: "algorithmTag",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setFilter: (state, action: PayloadAction<TagEntity[]>) => {
      state.filter = action.payload;
    },
    setAlgorithmTagList: (state, action: PayloadAction<TagEntity[]>) => {
      state.tagList = action.payload;
    }
  }
});

export const { setLoading, setAlgorithmTagList, setFilter } = algorithmTagSlice.actions;

export default algorithmTagSlice.reducer;
