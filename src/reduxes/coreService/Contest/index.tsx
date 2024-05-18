import { createSlice } from "@reduxjs/toolkit";
import { ContestEntity } from "models/coreService/entity/ContestEntity";

interface InitialState {
  isLoading: boolean;
  contests: {
    contests: ContestEntity[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
  mostPopularContests: {
    mostPopularContests: ContestEntity[];
    numOfParticipants: number;
    numOfContests: number;
  };
}

const initState: InitialState = {
  isLoading: false,
  contests: {
    contests: [],
    currentPage: 0,
    totalItems: 0,
    totalPages: 0
  },
  mostPopularContests: {
    mostPopularContests: [],
    numOfParticipants: 0,
    numOfContests: 0
  }
};

const contestSlice = createSlice({
  name: "contest",
  initialState: initState,
  reducers: {
    setContests: (state, action) => {
      state.contests.contests = action.payload.contests;
      state.contests.currentPage = action.payload.currentPage;
      state.contests.totalItems = action.payload.totalItems;
      state.contests.totalPages = action.payload.totalPages;
    },
    setMostPopularContests: (state, action) => {
      state.mostPopularContests.mostPopularContests = action.payload.mostPopularContests;
      state.mostPopularContests.numOfParticipants = action.payload.numOfParticipants;
      state.mostPopularContests.numOfContests = action.payload.numOfContests;
    }
  }
});

export const { setContests, setMostPopularContests } = contestSlice.actions;

export default contestSlice.reducer;
