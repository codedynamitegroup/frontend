import { configureStore } from "@reduxjs/toolkit";
import selectedReducer from "reduxes/Selected/index";
import codePlagiarismReducer from "reduxes/CodePlagiarism/index";
import selectRubricDialogReducer from "reduxes/SelectRubricDialog/index";
import rubricDialogReducer from "reduxes/NewEditRubricDialog/index";
import selectRubricCriteriaDialog from "reduxes/SelectRubricCriteriaDialog";
import rubricCriteriaConfigDialog from "reduxes/NewEditRubricCriteriaDialog";

const store = configureStore({
  reducer: {
    selected: selectedReducer,
    codePlagiarism: codePlagiarismReducer,
    selectRubricDialog: selectRubricDialogReducer,
    rubricDialog: rubricDialogReducer,
    selectCriteriaDialog: selectRubricCriteriaDialog,
    rubricCriteriaConfigDialog: rubricCriteriaConfigDialog
  },
  // middleware: getDefaultMiddleWare => getDefaultMiddleWare().concat(ap)
  devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
