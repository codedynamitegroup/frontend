import React from "react";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "routes/routes";
import CodeQuestionManagement from "pages/lecturer/CodeQuestionManagement";
import AssignmentCreate from "pages/lecturer/Assignment/AssignmentCreate";
import CreateEssayExercises from "pages/lecturer/CreateEssayExercises";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.lecturer.code_management} Component={CodeQuestionManagement} />
        <Route path={routes.lecturer.assignment_management} Component={AssignmentCreate} />
        <Route path={routes.lecturer.create_essay} Component={CreateEssayExercises} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
