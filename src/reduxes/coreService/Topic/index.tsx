import { createSlice } from "@reduxjs/toolkit";
import { TopicEntity } from "models/coreService/entity/TopicEntity";

interface InitialState {
  isLoading: boolean;
  topics: TopicEntity[];
}

const initState: InitialState = {
  isLoading: false,
  topics: []
};

const topicSlice = createSlice({
  name: "topic",
  initialState: initState,
  reducers: {
    setTopics: (state, action) => {
      state.topics = action.payload.topics;
    }
  }
});

export const { setTopics } = topicSlice.actions;

export default topicSlice.reducer;
