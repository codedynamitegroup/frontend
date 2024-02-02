import "./App.scss";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom";
import CodeQuestionManagement from "pages/lecturer/CodeQuestionManagement";
import AssignmentCreated from "pages/lecturer/AssignmentManagement/CreateAssigment";
import ListProblem from "pages/client/user/ListProblem";
import DetailProblem from "pages/client/user/ListProblem/components/DetailProblem";
import AssignmentGrading from "pages/lecturer/AssignmentManagement/GradingAssignment";
import PdfViewer from "components/pdf/PdfViewer";
import AssignmentSubmission from "pages/client/user/AssignmentSubmission";
import CodeQuestionCreated from "pages/lecturer/CodeQuestionManagement/Create";
import CodeQuestionDetails from "pages/lecturer/CodeQuestionManagement/Details";
import DetailSolution from "pages/client/user/ListProblem/components/DetailProblem/components/ListSolution/components/DetailSolution";
import ExamCreated from "pages/lecturer/ExamManagemenent/CreateExam";
import QuestionCreated from "pages/lecturer/QuestionManagement/components/CreateQuestion";
import QuestionBankManagement from "pages/lecturer/QuestionBankManagement";
import qtype from "utils/constant/Qtype";
import CourseDetail from "pages/client/lecturer/CourseManagement/Details";
import { routes } from "routes/routes";
import LecturerCourseManagement from "pages/client/lecturer/CourseManagement";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={routes.lecturer.code_question.management} element={<CodeQuestionManagement />} />
      <Route path={routes.lecturer.code_question.create} element={<CodeQuestionCreated />} />
      <Route path={routes.user.problem.list} element={<ListProblem />} />
      <Route path={routes.user.problem.detail} element={<DetailProblem />} />

      <Route path={routes.lecturer.code_question.detail} Component={CodeQuestionDetails} />
      <Route path={routes.lecturer.assignment.create} element={<AssignmentCreated />} />
      <Route path={routes.lecturer.assignment.grading} element={<AssignmentGrading />} />
      <Route path={"/grading-pdf"} element={<PdfViewer document={"Document.pdf"} />} />
      <Route path={routes.user.assignment.submission} element={<AssignmentSubmission />} />
      <Route path={routes.lecturer.exam.create} element={<ExamCreated />} />
      <Route path={routes.lecturer.course.management} element={<LecturerCourseManagement />} />

      <Route path={routes.lecturer.course.detail} Component={CourseDetail} />

      <Route
        path={routes.lecturer.question.essay.create}
        element={<QuestionCreated qtype={qtype.essay.code} />}
      />
      <Route
        path={routes.lecturer.question.multiple_choice.create}
        element={<QuestionCreated qtype={qtype.multiple_choice.code} />}
      />
      <Route
        path={routes.lecturer.question.short_answer.create}
        element={<QuestionCreated qtype={qtype.short_answer.code} />}
      />
      <Route
        path={routes.lecturer.question.true_false.create}
        element={<QuestionCreated qtype={qtype.true_false.code} />}
      />
      <Route path={routes.lecturer.question_bank.path} element={<QuestionBankManagement />} />
      <Route path={routes.lecturer.assignment.create} element={<AssignmentCreated />} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
