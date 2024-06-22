import { Reducer, configureStore } from "@reduxjs/toolkit";
import selectedReducer from "reduxes/Selected/index";
import codePlagiarismReducer from "reduxes/CodePlagiarism/index";
import selectRubricDialogReducer from "reduxes/SelectRubricDialog/index";
import rubricDialogReducer from "reduxes/NewEditRubricDialog/index";
import selectRubricCriteriaDialog from "reduxes/SelectRubricCriteriaDialog";
import rubricCriteriaConfigDialog from "reduxes/NewEditRubricCriteriaDialog";
import chapterReducer from "reduxes/coreService/Chapter/index";
import algorithmTagReducer from "reduxes/CodeAssessmentService/CodeQuestion/Filter/Algorithm";
import courseReducer from "reduxes/courseService/course/index";
import sectionReducer from "reduxes/courseService/section/index";
import submissionAssignmentReducer from "reduxes/courseService/submission_assignment/index";
import examReducer from "reduxes/courseService/exam/index";
import assignmentReducer from "reduxes/courseService/assignment/index";
import courseTypeReducer from "reduxes/courseService/course_type/index";
import questionReducer from "reduxes/courseService/question/index";
import questionBankCategory from "reduxes/courseService/questionBankCategory";
import SearchAndDifficultyAndSolved from "reduxes/CodeAssessmentService/CodeQuestion/Filter/SearchAndDifficultyAndSolved";
import detailCodeQuestion from "reduxes/CodeAssessmentService/CodeQuestion/Detail/DetailCodeQuestion";
import courseUser from "reduxes/courseService/courseUser";
import auth from "reduxes/Auth";
import loading from "reduxes/Loading";
import questionCreate from "reduxes/coreService/questionCreate/index";
import takeExam from "reduxes/TakeExam";
import codeQuestionReducer from "reduxes/coreService/CodeQuestion";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { InitialState as TakeExamInitialState } from "reduxes/TakeExam";
import { PersistPartial } from "redux-persist/lib/persistReducer";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import questionCategory from "reduxes/coreService/questionCategory";
import Execute from "reduxes/CodeAssessmentService/CodeQuestion/Execute";
import ExecuteResult from "reduxes/CodeAssessmentService/CodeQuestion/Execute/ExecuteResult";
import appStatus from "reduxes/AppStatus";
import adminCertificateCourse from "reduxes/coreService/AdminCertificateCourse";
import SidebarStatus from "reduxes/SidebarStatus";
import EditMode from "reduxes/EditMode";

const persistConfig = {
  key: "takeExam",
  storage,
  whitelist: ["questionList", "examId", "startAt", "endAt", "examData"],
  debug: true
};
const takeExamPersistedReducer: Reducer<TakeExamInitialState & PersistPartial> = persistReducer(
  persistConfig,
  takeExam
);

const store = configureStore({
  reducer: {
    selected: selectedReducer,
    editMode: EditMode,
    codePlagiarism: codePlagiarismReducer,
    selectRubricDialog: selectRubricDialogReducer,
    rubricDialog: rubricDialogReducer,
    selectCriteriaDialog: selectRubricCriteriaDialog,
    rubricCriteriaConfigDialog: rubricCriteriaConfigDialog,
    chapter: chapterReducer,
    algorithmnTag: algorithmTagReducer,
    course: courseReducer,
    courseType: courseTypeReducer,
    section: sectionReducer,
    assignment: assignmentReducer,
    submissionAssignment: submissionAssignmentReducer,
    exam: examReducer,
    searchAndDifficultyAndSolved: SearchAndDifficultyAndSolved,
    question: questionReducer,
    codeQuestion: codeQuestionReducer,
    questionBankCategory: questionBankCategory,
    detailCodeQuestion: detailCodeQuestion,
    courseUser: courseUser,
    executeData: Execute,
    executeResultData: ExecuteResult,
    auth: auth,
    questionCreate: questionCreate,
    takeExam: takeExamPersistedReducer,
    questionCategory: questionCategory,
    loading: loading,
    appStatus: appStatus,
    adminCertificateCourse: adminCertificateCourse,
    sidebarStatus: SidebarStatus
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }),
  devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const persistor = persistStore(store);

export default store;
