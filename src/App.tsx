import "./App.scss";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";
import { routes } from "routes/routes";
import CodeQuestionManagement from "pages/lecturer/CodeQuestionManagement";
import AssignmentCreated from "pages/lecturer/AssignmentManagement/components/CreateAssigment";
import CodeQuestionCreated from "pages/lecturer/CodeQuestionManagement/components/CreateCodeQuestion";
import QuestionCreated from "pages/lecturer/QuestionManagement/components/CreateQuestion";
import QuestionBankManagement from "pages/lecturer/QuestionBankManagement";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={routes.lecturer.code_question.management} element={<CodeQuestionManagement />} />
      <Route path={routes.lecturer.code_question.create} element={<CodeQuestionCreated />} />
      <Route path={routes.lecturer.assignment.create} element={<AssignmentCreated />} />
      <Route path={routes.lecturer.question.path}>
        {routes.lecturer.question.qtype.map((qtype) => (
          <Route
            path={`${qtype}/${routes.lecturer.question.create.path}`}
            element={<QuestionCreated qtype={qtype} />}
          />
        ))}
      </Route>
      <Route path={routes.lecturer.question_bank.path} element={<QuestionBankManagement />} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
