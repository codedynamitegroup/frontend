import React from "react";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "routes/routes";
import CodeQuestionManagement from "pages/lecturer/CodeQuestionManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.lecturer.code_management} Component={CodeQuestionManagement} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
