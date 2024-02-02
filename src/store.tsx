import { configureStore } from "@reduxjs/toolkit";
import selectedReducer from "reduxes/Selected/index";

export const store = configureStore({
  reducer: {
    selected: selectedReducer
  },
  // middleware: getDefaultMiddleWare => getDefaultMiddleWare().concat(ap)
  devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
