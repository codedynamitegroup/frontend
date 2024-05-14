import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { TopicEntity } from "models/coreService/entity/TopicEntity";

const coreServiceApiUrl = process.env.REACT_APP_CORE_SERVICE_API_URL || "";

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

export const fetchAllTopics = createAsyncThunk(
  "topics/fetchAll",
  async (
    data: {
      pageNo: number;
      pageSize: number;
      fetchAll: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${coreServiceApiUrl}topics`, {
        params: {
          pageNo: data.pageNo,
          pageSize: data.pageSize,
          fetchAll: data.fetchAll
        }
      });
      if (response.status === 200) {
        return response.data;
      } else {
        console.error("Failed to fetch topics", response.data);
        return rejectWithValue(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch topics", error);
      return rejectWithValue(error);
    }
  }
);

const topicSlice = createSlice({
  name: "topic",
  initialState: initState,
  reducers: {
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllTopics.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchAllTopics.fulfilled, (state, action) => {
      state.isLoading = false;
      state.topicsFilter = action.payload.topics.map((topic: TopicEntity) => ({
        checked: false,
        topic
      }));
    });
    builder.addCase(fetchAllTopics.rejected, (state) => {
      state.isLoading = false;
    });
  }
});

export const { setFilterForTopic } = topicSlice.actions;

export default topicSlice.reducer;
