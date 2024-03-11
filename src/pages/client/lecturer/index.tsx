import { Box, Grid } from "@mui/material";
import React from "react";
import classes from "./styles.module.scss";
import { Route, Routes } from "react-router";
import LecturerEventCalendar from "./LecturerEventCalendar";
import LecturerCourses from "./CourseManagement";
import LecturerCourseDetail from "./CourseManagement/Details";
import SidebarLecturer from "components/common/sidebars/SidebarLecturer";
import LecturerCodeQuestionManagement from "./CodeQuestionManagement";
import LecturerCodeQuestionDetails from "./CodeQuestionManagement/Details";
import LecturerCodeQuestionCreation from "./CodeQuestionManagement/Create";
import QuestionBankManagementLayout from "./QuestionBankManagement/QuestionBankManagementLayout";
import QuestionBankManagement from "./QuestionBankManagement";
import { routes } from "routes/routes";
import QuestionListOfCourse from "./QuestionBankManagement/QuestionListOfCourse";
import AIQuestionCreated from "./QuestionManagement/components/AICreateQuestion";
import QuestionCreated from "./QuestionManagement/components/CreateQuestion";

type Props = {};

const LecturerCoursesManagement = (props: Props) => {
  return (
    <Grid className={classes.root}>
      <SidebarLecturer>
        <Box className={classes.container}>
          <Box className={classes.body}>
            <Routes>
              <Route path={"courses"} element={<LecturerCourses />} />
              <Route path={"courses/:courseId/*"} element={<LecturerCourseDetail />} />
              <Route path={"code-questions"} element={<LecturerCodeQuestionManagement />} />
              <Route path={"code-questions/create"} element={<LecturerCodeQuestionCreation />} />
              <Route path={"code-questions/edit/:id/*"} element={<LecturerCodeQuestionDetails />} />
              <Route path={"calendar"} element={<LecturerEventCalendar />} />
              <Route
                path={"question-bank-management"}
                element={<QuestionBankManagementLayout />}
                handle={{
                  crumbName: "Ngân hàng câu hỏi"
                }}
              >
                <Route index element={<QuestionBankManagement />} />
                <Route
                  path={routes.lecturer.question_bank.questions_list_of_category.path}
                  element={<QuestionListOfCourse />}
                  handle={{ crumbName: "Học thuật toán", state: { reset: true } }}
                >
                  {routes.lecturer.question_bank.questions_list_of_category.create_question.paths.map(
                    (value, index) => {
                      return (
                        <Route
                          path={value.path}
                          element={
                            value.code === "ai" ? (
                              <AIQuestionCreated />
                            ) : (
                              <QuestionCreated qtype={value.code} />
                            )
                          }
                          handle={{ crumbName: "Tạo câu hỏi" }}
                          key={index}
                        />
                      );
                    }
                  )}
                  {routes.lecturer.question_bank.questions_list_of_category.update_question.paths.map(
                    (value, index) => {
                      return (
                        <Route
                          path={value.path}
                          element={<QuestionCreated qtype={value.code} />}
                          handle={{ crumbName: "Chỉnh sửa câu hỏi" }}
                          key={index}
                        />
                      );
                    }
                  )}
                </Route>
              </Route>
            </Routes>
          </Box>
        </Box>
      </SidebarLecturer>
    </Grid>
  );
};

export default LecturerCoursesManagement;
