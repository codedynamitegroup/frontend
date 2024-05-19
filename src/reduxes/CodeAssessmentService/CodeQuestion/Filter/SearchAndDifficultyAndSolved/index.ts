import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";

interface InitialState {
  difficulty: QuestionDifficultyEnum | null;
  solved: boolean | null;
  searchKey: string | null;
}

const initialState: InitialState = {
  difficulty: null,
  solved: null,
  searchKey: null
};

export const searchAndDifficultyAndSolvedSlice = createSlice({
  name: "searchAndDifficultyAndSolved",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setDifficulty: (state, action: PayloadAction<QuestionDifficultyEnum | null>) => {
      state.difficulty = action.payload;
    },
    setSolved: (state, action: PayloadAction<boolean | null>) => {
      state.solved = action.payload;
    },
    setSearchKey: (state, action: PayloadAction<string | null>) => {
      state.searchKey = action.payload;
    }
  }
});

export const { setDifficulty, setSolved, setSearchKey } = searchAndDifficultyAndSolvedSlice.actions;

export default searchAndDifficultyAndSolvedSlice.reducer;
