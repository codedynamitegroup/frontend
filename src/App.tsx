import React from "react";
import "./App.scss";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";
import { routes } from "routes/routes";
import CodeQuestionManagement from "pages/lecturer/CodeQuestionManagement";
import CustomTabPanel from "components/common/CustomTabPanel";
import AssignmentCreated from "pages/lecturer/AssignmentManagement/CreateAssigment";
import ListProblem from "pages/client/user/ListProblem";
import DetailProblem from "pages/client/user/ListProblem/components/DetailProblem";
import AssignmentGrading from "pages/lecturer/AssignmentManagement/GradingAssignment";
import PdfViewer from "components/pdf/PdfViewer";
import AssignmentSubmission from "pages/client/user/AssignmentSubmission";
import CodeQuestionCreated from "pages/lecturer/CodeQuestionManagement/Create";
import CodeQuestionDetails from "pages/lecturer/CodeQuestionManagement/Details";
import ExamCreated from "pages/lecturer/ExamManagemenent/CreateExam";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={routes.lecturer.code_question.management} element={<CodeQuestionManagement />} />
      <Route path={routes.lecturer.code_question.create} element={<CodeQuestionCreated />} />
      <Route path={routes.user.problem.list} element={<ListProblem />} />
      <Route path={routes.user.problem.detail} element={<DetailProblem />} />

      <Route path={routes.lecturer.code_question.details} Component={CodeQuestionDetails} />
      <Route path={routes.lecturer.assignment.create} element={<AssignmentCreated />} />
      <Route path={routes.lecturer.assignment.grading} element={<AssignmentGrading />} />
      <Route path={"/grading-pdf"} element={<PdfViewer document={"Document.pdf"} />} />
      <Route path={routes.user.assignment.submission} element={<AssignmentSubmission />} />
      <Route path={routes.lecturer.exam.create} element={<ExamCreated />} />
      <Route
        path={routes.lecturer.course_management.path}
        element={<routes.lecturer.course_management.Component />}
      />

      <Route
        element={
          <CustomTabPanel
            routeList={[
              routes.lecturer.course.detail.path,
              routes.lecturer.course.grade.path,
              routes.lecturer.course.participant.path
            ]}
            labelList={["Lớp học", "Bài tập", "Điểm", "Thành viên"]}
          />
        }
      >
        <Route
          path={routes.lecturer.course.grade.path}
          element={<routes.lecturer.course.grade.Component />}
        />
        <Route
          path={routes.lecturer.course.detail.path}
          element={<routes.lecturer.course.detail.Component />}
        />
        <Route
          path={routes.lecturer.course.participant.path}
          element={<routes.lecturer.course.participant.Component />}
        />
      </Route>
      <Route
        path={routes.user.course.detail.path}
        element={<routes.user.course.detail.Component />}
      />
      <Route
        path={routes.user.course.grade.path}
        element={<routes.user.course.grade.Component />}
      />
      <Route
        path={routes.user.course.participant.path}
        element={<routes.user.course.participant.Component />}
      />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
