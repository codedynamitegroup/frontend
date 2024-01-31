import React from "react";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routes } from "routes/routes";
import CodeQuestionManagement from "pages/lecturer/CodeQuestionManagement";
import AssignmentCreate from "pages/lecturer/Assignment/AssignmentCreate";
import CustomTabPanel from "components/common/CustomTabPanel";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LECTURER */}
        <Route path={routes.lecturer.code_management} Component={CodeQuestionManagement} />
        <Route path={routes.lecturer.assignment_management} Component={AssignmentCreate} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
