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
import AssignmentCreated from "pages/lecturer/AssignmentManagement/CreateAssigment";
import ListProblem from "pages/client/user/ListProblem";
import AssignmentGrading from "pages/lecturer/AssignmentManagement/GradingAssignment";
import CodeQuestionCreated from "pages/lecturer/CodeQuestionManagement/Create";
import CodeQuestionDetails from "pages/lecturer/CodeQuestionManagement/Details";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={routes.lecturer.code_question.management} element={<CodeQuestionManagement />} />
      <Route path={routes.lecturer.code_question.create} element={<CodeQuestionCreated />} />
      <Route path={routes.lecturer.code_question.details} Component={CodeQuestionDetails} />
      <Route path={routes.lecturer.assignment.create} element={<AssignmentCreated />} />
      <Route path={routes.lecturer.assignment.grading} Component={AssignmentGrading} />
      <Route path={routes.user.problem} Component={ListProblem} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
