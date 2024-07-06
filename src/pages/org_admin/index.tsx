import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { Route, Routes } from "react-router";
import RequireAuth from "components/common/RequireAuth";
import { ERoleName } from "models/authService/entity/role";
import { toggleSidebar } from "reduxes/SidebarStatus";
import { useDispatch } from "react-redux";
import React, { lazy } from "react";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
const UserInformation = lazy(() => import("pages/client/user/UserDetails/UserInformation"));
const UserManagement = lazy(() => import("./UserManagement/UserManagement"));
const EditUserDetails = lazy(() => import("./UserManagement/EditUserDetails"));
const SidebarOrganizationAdmin = lazy(
  () => import("components/common/sidebars/SidebarOrganizationAdmin")
);
const OrgAdminQuestionBankManagement = lazy(() => import("./QuestionBankManagement"));
const QuestionListOfCourse = lazy(() => import("./QuestionBankManagement/QuestionListOfCourse"));

const CreateShortAnswerQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateShortAnswerQuestion"
    )
);
const CreateEssayQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateEssayQuestion"
    )
);
const CreateMultichoiceQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateMultichoiceQuestion"
    )
);
const CreateTrueFalseQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateTrueFalseQuestion"
    )
);
const LecturerCodeQuestionCreation = lazy(
  () => import("pages/client/lecturer/CodeQuestionManagement/Create")
);
const OrgAdminContestManagement = lazy(
  () => import("./ContestManagement/OrgAdminContestManagement")
);
const OrgAdminCreateContest = lazy(() => import("./ContestManagement/OrgAdminCreateContest"));
const OrgAdminEditContestDetails = lazy(
  () => import("./ContestManagement/OrgAdminEditContestDetails")
);
const OrgAdminContestSubmissionDetails = lazy(
  () => import("./ContestManagement/OrgAdminContestSubmissionDetails")
);
const OrgAdminContestSubmissions = lazy(
  () => import("./ContestManagement/OrgAdminContestSubmissions")
);

const OrganizationAdminDashboard = lazy(() => import("./Dashboard"));

type Props = {};

const OrganizationAdminHomepage = (props: Props) => {
  const [open, setOpen] = React.useState(true);
  const dispatch = useDispatch();

  const toggleDrawer = () => {
    setOpen((pre) => !pre);
    dispatch(toggleSidebar());
  };

  return (
    <Grid className={classes.root}>
      <SidebarOrganizationAdmin open={open} toggleDrawer={toggleDrawer}>
        {/* <Box className={classes.container}> */}
        <Box className={classes.body}>
          <Routes>
            <Route path={"contests"} element={<OrgAdminContestManagement />} />
            <Route path={"contests/create"} element={<OrgAdminCreateContest />} />
            <Route
              path={"contests/:contestId/submissions"}
              element={<OrgAdminContestSubmissions />}
            />
            <Route
              path={"contests/:contestId/submissions/:submissionId"}
              element={<OrgAdminContestSubmissionDetails />}
            />
            <Route
              path={"contests/edit/:contestId/*"}
              element={<OrgAdminEditContestDetails isDrawerOpen={open} />}
            />

            <Route path={"information"} element={<UserInformation />} />
            <Route path={"users"} element={<UserManagement />} />
            <Route path={"users/edit/:userId/*"} element={<EditUserDetails />} />

            <Route path={"question-bank-management"} element={<OrgAdminQuestionBankManagement />} />
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
            />

            <Route path={"dashboard"} element={<OrganizationAdminDashboard />} />
          </Routes>
        </Box>
        {/* </Box> */}
      </SidebarOrganizationAdmin>
    </Grid>
  );
};

export default OrganizationAdminHomepage;
