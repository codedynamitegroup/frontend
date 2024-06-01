import { configureStore } from "@reduxjs/toolkit";
import selectedReducer from "reduxes/Selected/index";
import codePlagiarismReducer from "reduxes/CodePlagiarism/index";
import selectRubricDialogReducer from "reduxes/SelectRubricDialog/index";
import rubricDialogReducer from "reduxes/NewEditRubricDialog/index";
import selectRubricCriteriaDialog from "reduxes/SelectRubricCriteriaDialog";
import rubricCriteriaConfigDialog from "reduxes/NewEditRubricCriteriaDialog";
import topicReducer from "reduxes/coreService/Topic/index";
import certificateCourseReducer from "reduxes/coreService/CertificateCourse/index";
import chapterReducer from "reduxes/coreService/Chapter/index";
import contestReducer from "reduxes/coreService/Contest/index";
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
import questionCategory from "reduxes/coreService/questionCategory";
import Execute from "reduxes/CodeAssessmentService/CodeQuestion/Execute";

const store = configureStore({
  reducer: {
    selected: selectedReducer,
    codePlagiarism: codePlagiarismReducer,
    selectRubricDialog: selectRubricDialogReducer,
    rubricDialog: rubricDialogReducer,
    selectCriteriaDialog: selectRubricCriteriaDialog,
    rubricCriteriaConfigDialog: rubricCriteriaConfigDialog,
    topic: topicReducer,
    certifcateCourse: certificateCourseReducer,
    chapter: chapterReducer,
    contest: contestReducer,
    algorithmnTag: algorithmTagReducer,
    course: courseReducer,
    courseType: courseTypeReducer,
    section: sectionReducer,
    assignment: assignmentReducer,
    submissionAssignment: submissionAssignmentReducer,
    exam: examReducer,
    searchAndDifficultyAndSolved: SearchAndDifficultyAndSolved,
    question: questionReducer,
    questionBankCategory: questionBankCategory,
    detailCodeQuestion: detailCodeQuestion,
    courseUser: courseUser,
    executeData: Execute,
    auth: auth,
    questionCreate: questionCreate,
    questionCategory: questionCategory,
    loading: loading
  },
  // middleware: getDefaultMiddleWare => getDefaultMiddleWare().concat(ap)
  devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
