import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TagEntity } from "models/codeAssessmentService/entity/TagEntity";

// Define a type for the slice state
interface InitialState {
  isLoading: boolean;
  tagList: TagEntity[];
}

// Define the initial state using that type
const initialState: InitialState = {
  isLoading: false,
  tagList: []
};

export const algorithmTagSlice = createSlice({
  name: "algorithmTag",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setAlgorithmTagList: (state, action: PayloadAction<TagEntity[]>) => {
      state.tagList = action.payload;
    }
  }
});

export const { setLoading, setAlgorithmTagList } = algorithmTagSlice.actions;

export default algorithmTagSlice.reducer;
