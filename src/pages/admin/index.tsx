import { Box, Grid } from "@mui/material";
import React, { lazy } from "react";
import classes from "./styles.module.scss";
import { Route, Routes } from "react-router";
import { useDispatch } from "react-redux";
import { toggleSidebar } from "reduxes/SidebarStatus";
import qtype from "utils/constant/Qtype";

const RequireAuth = lazy(() => import("components/common/RequireAuth"));
const ContestManagement = lazy(() => import("./ContestManagement/ContestManagement"));
const CreateContest = lazy(() => import("./ContestManagement/CreateContest"));
const EditContestDetails = lazy(() => import("./ContestManagement/EditContestDetails"));
const SidebarSystemAdmin = lazy(() => import("components/common/sidebars/SidebarSystemAdmin"));
const UserInformation = lazy(() => import("pages/client/user/UserDetails/UserInformation"));
const AdminDashboard = lazy(() => import("./Dashboard"));
const UserManagement = lazy(() => import("./UserManagement/UserManagement"));
const CreateUser = lazy(() => import("./UserManagement/CreateUser"));
const EditUserDetails = lazy(() => import("./UserManagement/EditUserDetails"));
const CertificateCourseManagement = lazy(
  () => import("./CertificateCourseManagement/CertificateCourseManagement")
);
// const QuestionListOfCourse = lazy(() => import("./QuestionBankManagement/QuestionListOfCourse"));
// const CreateShortAnswerQuestion = lazy(
//   () =>
//     import(
//       "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateShortAnswerQuestion"
//     )
// );
// const CreateEssayQuestion = lazy(
//   () =>
//     import(
//       "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateEssayQuestion"
//     )
// );
// const CreateMultichoiceQuestion = lazy(
//   () =>
//     import(
//       "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateMultichoiceQuestion"
//     )
// );
// const CreateTrueFalseQuestion = lazy(
//   () =>
//     import(
//       "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateTrueFalseQuestion"
//     )
// );
// const LecturerCodeQuestionCreation = lazy(
//   () => import("pages/client/lecturer/QuestionManagement/components/CodeQuestionDetails")
// );
// const AdminQuestionBankManagement = lazy(() => import("./QuestionBankManagement"));
const CreateCertificateCourse = lazy(
  () => import("./CertificateCourseManagement/CreateCertificateCourse")
);
const AdminContestSubmissions = lazy(() => import("./ContestManagement/AdminContestSubmissions"));
const AdminCodeQuestionManagement = lazy(() => import("./CodeQuestionManagement"));
const AdminCodeQuestionCreation = lazy(() => import("./CodeQuestionManagement/Create"));
const AdminContestSubmissionDetails = lazy(
  () => import("./ContestManagement/AdminContestSubmissionDetails")
);
const OrganizationManagement = lazy(
  () => import("./OrganizationManagement/OrganizationManagement")
);
const CreateOrganization = lazy(() => import("./OrganizationManagement/CreateOrganization"));
const EditOrganizationDetails = lazy(
  () => import("./OrganizationManagement/EditOrganizationDetails")
);
const UpdateCertificateCourse = lazy(
  () => import("./CertificateCourseManagement/UpdateCertificateCourse")
);
const AdminCodeQuestionDetails = lazy(() => import("./CodeQuestionManagement/Details"));
const TopicManagement = lazy(() => import("./CertificateCourseManagement/TopicManagement"));
const CreateTopic = lazy(() => import("./CertificateCourseManagement/TopicManagement/CreateTopic"));
type Props = {};

const SystemAdminHomepage = (props: Props) => {
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    setOpen((pre) => !pre);
    dispatch(toggleSidebar());
  };
  return (
    <Grid className={classes.root}>
      <SidebarSystemAdmin open={open} toggleDrawer={toggleDrawer}>
        {/* <Box className={classes.container}> */}
        <Box className={classes.adminBody}>
          <Routes>
            <Route path={"contests"} element={<ContestManagement />} />
            <Route path={"contests/create"} element={<CreateContest />} />
            <Route path={"contests/:contestId/submissions"} element={<AdminContestSubmissions />} />
            <Route
              path={"contests/:contestId/submissions/:submissionId"}
              element={<AdminContestSubmissionDetails />}
            />
            <Route
              path={"contests/edit/:contestId/*"}
              element={<EditContestDetails isDrawerOpen={open} />}
            />
            <Route path={"information"} element={<UserInformation />} />
            <Route path={"/dashboard"} element={<AdminDashboard />} />

            <Route path={"users"} element={<UserManagement />} />
            <Route path={"users/create"} element={<CreateUser />} />
            <Route path={"users/edit/:userId/*"} element={<EditUserDetails />} />

            <Route path={"organizations"} element={<OrganizationManagement />} />
            <Route path={"organizations/create"} element={<CreateOrganization />} />
            <Route
              path={"organizations/edit/:organizationId/*"}
              element={<EditOrganizationDetails />}
            />

            <Route path={"/certificate-course"} element={<CertificateCourseManagement />} />

            {/* <Route path={"question-bank-management"} element={<AdminQuestionBankManagement />} />
            <Route
              path={"question-bank-management/:categoryId"}
              element={<QuestionListOfCourse />}
            />
            <Route
              // path={routes.org_admin.question_bank.create_question.short_answer}
              path={"question-bank-management/:categoryId/create/short-answer"}
              element={<CreateShortAnswerQuestion qtype={qtype.short_answer.code} />}
            />
            <Route
              path={"question-bank-management/:categoryId/create/essay"}
              element={<CreateEssayQuestion qtype={qtype.essay.code} />}
            />
            <Route
              path={"question-bank-management/:categoryId/create/multiple-choice"}
              element={<CreateMultichoiceQuestion qtype={qtype.multiple_choice.code} />}
            />
            <Route
              path={"question-bank-management/:categoryId/create/true-false"}
              element={<CreateTrueFalseQuestion qtype={qtype.true_false.code} />}
            />
            <Route
              path={"question-bank-management/:categoryId/create/code"}
              element={<LecturerCodeQuestionCreation />}
            /> */}
            <Route path={"/certificate-course/create"} element={<CreateCertificateCourse />} />

            <Route path={"/code-questions"} element={<AdminCodeQuestionManagement />} />
            <Route path={"/code-questions/create"} element={<AdminCodeQuestionDetails />} />
            <Route
              path='code-questions/detail/:codeQuestionId'
              element={<AdminCodeQuestionDetails />}
            />
            <Route path={"/certificate-course/:id"} element={<UpdateCertificateCourse />} />
            <Route path={"/topics"} element={<TopicManagement />} />
            <Route path={"/topics/create"} element={<CreateTopic />} />
          </Routes>
        </Box>
        {/* </Box> */}
      </SidebarSystemAdmin>
    </Grid>
  );
};

export default SystemAdminHomepage;
