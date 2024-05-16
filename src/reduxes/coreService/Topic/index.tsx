import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TopicEntity } from "models/coreService/entity/TopicEntity";
import { TopicService } from "services/coreService/TopicService";

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

// export const fetchAllTopics = createAsyncThunk(
//   "topics/fetchAll",
//   async (
//     data: {
//       pageNo?: number;
//       pageSize?: number;
//       fetchAll: boolean;
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       return TopicService.getTopics({
//         pageNo: data.pageNo,
//         pageSize: data.pageSize,
//         fetchAll: data.fetchAll
//       });
//     } catch (error: any) {
//       console.error("Failed to fetch topics", error);
//       return rejectWithValue({
//         code: error.response?.code || 503,
//         status: error.response?.status || "Service Unavailable",
//         message: error.response?.message || error.message
//       });
//     }
//   }
// );

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
  // extraReducers: (builder) => {
  //   builder.addCase(fetchAllTopics.pending, (state) => {
  //     state.isLoading = true;
  //   });
  //   builder.addCase(fetchAllTopics.fulfilled, (state, action) => {
  //     state.isLoading = false;
  //     state.topicsFilter = action.payload.topics.map((topic: TopicEntity) => ({
  //       checked: false,
  //       topic
  //     }));
  //   });
  //   builder.addCase(fetchAllTopics.rejected, (state) => {
  //     state.isLoading = false;
  //   });
  // }
});

export const { setTopics, setFilterForTopic } = topicSlice.actions;

export default topicSlice.reducer;
