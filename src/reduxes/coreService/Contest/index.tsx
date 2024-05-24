import { createSlice } from "@reduxjs/toolkit";
import { ContestEntity } from "models/coreService/entity/ContestEntity";
import { ContestLeaderboardEntity } from "models/coreService/entity/ContestLeaderboardEntity";

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
  contestDetails: ContestEntity | null;
  contestLeaderboard: ContestLeaderboardEntity | null;
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
  },
  contestDetails: null,
  contestLeaderboard: null
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
    },
    setContestDetails: (state, action) => {
      state.contestDetails = action.payload;
    },
    setContestLeaderboard: (state, action) => {
      state.contestLeaderboard = action.payload;
    }
  }
});

export const { setContests, setMostPopularContests, setContestDetails, setContestLeaderboard } =
  contestSlice.actions;

export default contestSlice.reducer;
