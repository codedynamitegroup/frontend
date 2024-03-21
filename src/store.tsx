import { configureStore } from "@reduxjs/toolkit";
import selectedReducer from "reduxes/Selected/index";
import codePlagiarismReducer from "reduxes/CodePlagiarism/index";

const store = configureStore({
  reducer: {
    selected: selectedReducer,
    codePlagiarism: codePlagiarismReducer
  },
  // middleware: getDefaultMiddleWare => getDefaultMiddleWare().concat(ap)
  devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
