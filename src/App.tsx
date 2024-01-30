import React from "react";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "routes/routes";
import CodeQuestionManagement from "pages/lecturer/CodeQuestionManagement";
import AssignmentCreated from "pages/lecturer/AssignmentManagement/CreateAssigment";
import CodeQuestionCreated from "pages/lecturer/CodeQuestionManagement/components/CreateCodeQuestion";
import AssignmentGrading from "pages/lecturer/AssignmentManagement/GradingAssignment";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.lecturer.code_question.management} Component={CodeQuestionManagement} />
        <Route path={routes.lecturer.code_question.create} Component={CodeQuestionCreated} />
        <Route path={routes.lecturer.assignment.create} Component={AssignmentCreated} />
        <Route path={routes.lecturer.assignment.grading} Component={AssignmentGrading} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
