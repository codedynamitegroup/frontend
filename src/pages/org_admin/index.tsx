import { Box, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import { Route, Routes } from "react-router";
import RequireAuth from "components/common/RequireAuth";
import { ERoleName } from "models/authService/entity/role";
import UserInformation from "pages/client/user/UserDetails/UserInformation";
import React from "react";
import UserManagement from "./UserManagement/UserManagement";
import EditUserDetails from "./UserManagement/EditUserDetails";
import SidebarOrganizationAdmin from "components/common/sidebars/SidebarOrganizationAdmin";
import OrgAdminQuestionBankManagement from "./QuestionBankManagement";
import QuestionListOfCourse from "./QuestionBankManagement/QuestionListOfCourse";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import CreateShortAnswerQuestion from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateShortAnswerQuestion";
import CreateEssayQuestion from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateEssayQuestion";
import CreateMultichoiceQuestion from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateMultichoiceQuestion";
import CreateTrueFalseQuestion from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateTrueFalseQuestion";
import LecturerCodeQuestionCreation from "pages/client/lecturer/CodeQuestionManagement/Create";
import OrgAdminContestManagement from "./ContestManagement/OrgAdminContestManagement";
import OrgAdminCreateContest from "./ContestManagement/OrgAdminCreateContest";
import OrgAdminEditContestDetails from "./ContestManagement/OrgAdminEditContestDetails";
import OrgAdminContestSubmissionDetails from "./ContestManagement/OrgAdminContestSubmissionDetails";
import OrgAdminContestSubmissions from "./ContestManagement/OrgAdminContestSubmissions";
import { toggleSidebar } from "reduxes/SidebarStatus";
import { useDispatch } from "react-redux";

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
          </Routes>
        </Box>
        {/* </Box> */}
      </SidebarOrganizationAdmin>
    </Grid>
  );
};

export default OrganizationAdminHomepage;
