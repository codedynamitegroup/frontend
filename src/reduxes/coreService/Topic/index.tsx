import { createSlice } from "@reduxjs/toolkit";
import { TopicEntity } from "models/coreService/entity/TopicEntity";

interface FilterByTopic {
  checked: boolean;
  topic: TopicEntity;
}

interface InitialState {
  isLoading: boolean;
  topicsFilter: FilterByTopic[];
}

const initState: InitialState = {
  isLoading: false,
  topicsFilter: []
};

const topicSlice = createSlice({
  name: "topic",
  initialState: initState,
  reducers: {
    setTopics: (state, action) => {
      state.topicsFilter = action.payload.topics.map((topic: TopicEntity) => ({
        checked: false,
        topic
      }));
    },
    setFilterForTopic: (state, action) => {
      state.topicsFilter = state.topicsFilter.map((topic) => {
        if (topic.topic.topicId === action.payload.topicId) {
          return {
            ...topic,
            checked: action.payload.checked
          };
        }
        return topic;
      });
    }
  }
});

export const { setTopics, setFilterForTopic } = topicSlice.actions;

export default topicSlice.reducer;
