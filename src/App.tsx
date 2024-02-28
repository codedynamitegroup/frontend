import PdfViewer from "components/pdf/PdfViewer";
import LecturerCourseManagement from "pages/client/lecturer/CourseManagement";
import CourseDetail from "pages/client/lecturer/CourseManagement/Details";
import AssignmentSubmission from "pages/client/student/AssignmentSubmission";
import StudentCourseManagement from "pages/client/student/CourseManagement";
import StudentCourseDetail from "pages/client/student/CourseManagement/Details";
import CourseCertificates from "pages/client/user/CourseCertificate";
import ListProblem from "pages/client/user/ListProblem";
import DetailProblem from "pages/client/user/ListProblem/components/DetailProblem";
import UserInformation from "pages/client/user/UserDetails/UserInformation";
import UserPasswordChange from "pages/client/user/UserDetails/UserPasswordChange";
import AssignmentCreated from "pages/lecturer/AssignmentManagement/CreateAssigment";
import AssignmentGrading from "pages/lecturer/AssignmentManagement/GradingAssignment";
import CodeQuestionManagement from "pages/lecturer/CodeQuestionManagement";
import CodeQuestionCreated from "pages/lecturer/CodeQuestionManagement/Create";
import CodeQuestionDetails from "pages/lecturer/CodeQuestionManagement/Details";
import ExamCreated from "pages/lecturer/ExamManagemenent/CreateExam";
import QuestionBankManagement from "pages/lecturer/QuestionBankManagement";
import QuestionCreated from "pages/lecturer/QuestionManagement/components/CreateQuestion";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import "./App.scss";
import HomePage from "pages/client/user/HomePage";
import CourseCertificateDetail from "pages/client/user/CourseCertificate/Detail";
import Login from "pages/client/user/Login";
import Register from "pages/client/user/Register";
import Forgotpassword from "pages/client/user/ForgotPassword";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={routes.lecturer.code_question.management} element={<CodeQuestionManagement />} />
      <Route path={routes.lecturer.code_question.create} element={<CodeQuestionCreated />} />
      <Route path={routes.user.problem.root} element={<ListProblem />} />
      <Route path={routes.user.problem.detail} element={<DetailProblem />} />
      <Route path={routes.user.password_change} element={<UserPasswordChange />} />
      <Route path={routes.user.homepage.root} element={<HomePage />} />
      <Route path={routes.user.login.root} element={<Login />} />
      <Route path={routes.user.register.root} element={<Register />} />
      <Route path={routes.user.forgot_password.root} element={<Forgotpassword />} />

      <Route path={routes.lecturer.code_question.detail} Component={CodeQuestionDetails} />
      <Route path={"/grading-pdf"} element={<PdfViewer document={"Document.pdf"} />} />
      <Route path={routes.lecturer.assignment.create} element={<AssignmentCreated />} />
      <Route path={routes.lecturer.assignment.grading} element={<AssignmentGrading />} />
      <Route path={routes.student.assignment.submit} element={<AssignmentSubmission />} />
      <Route path={routes.lecturer.exam.create} element={<ExamCreated />} />
      <Route path={routes.lecturer.course.management} element={<LecturerCourseManagement />} />

      <Route path={routes.student.course.management} element={<StudentCourseManagement />} />

      <Route path={routes.lecturer.course.detail} Component={CourseDetail} />

      <Route path={routes.student.course.detail} element={<StudentCourseDetail />} />
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
      <Route path={routes.user.information} element={<UserInformation />} />

      <Route path={routes.user.course_certificate.root} element={<CourseCertificates />} />

      <Route path={routes.user.course_certificate.detail} element={<CourseCertificateDetail />} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
