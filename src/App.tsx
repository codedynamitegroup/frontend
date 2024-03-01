import CustomPdfViewer from "components/pdf/CustomPdfViewer";
import QuestionBankManagementLayout from "layout/QuestionBankManagementLayout";
import LecturerCourseManagement from "pages/client/lecturer/CourseManagement";
import CourseDetail from "pages/client/lecturer/CourseManagement/Details";
import LecturerEventCalendar from "pages/client/lecturer/LecturerEventCalendar";
import AssignmentSubmission from "pages/client/student/AssignmentSubmission";
import StudentCourseManagement from "pages/client/student/CourseManagement";
import StudentCourseDetail from "pages/client/student/CourseManagement/Details";
import StudentEventCalendar from "pages/client/student/StudentEventCalendar";
import ContestList from "pages/client/user/Contest/ContestList";
import CourseCertificates from "pages/client/user/CourseCertificate";
import CourseCertificateDetail from "pages/client/user/CourseCertificate/Detail";
import CourseCertificateLessonProblem from "pages/client/user/CourseCertificate/Detail/DetailProblem";
import Forgotpassword from "pages/client/user/ForgotPassword";
import HomePage from "pages/client/user/HomePage";
import ListProblem from "pages/client/user/ListProblem";
import DetailProblem from "pages/client/user/ListProblem/components/DetailProblem";
import ShareSolution from "pages/client/user/ListProblem/components/DetailProblem/components/ListSolution/components/ShareSolution";
import Login from "pages/client/user/Login";
import Register from "pages/client/user/Register";
import UserInformation from "pages/client/user/UserDetails/UserInformation";
import AssignmentCreated from "pages/lecturer/AssignmentManagement/CreateAssigment";
import AssignmentGrading from "pages/lecturer/AssignmentManagement/GradingAssignment";
import CodeQuestionManagement from "pages/lecturer/CodeQuestionManagement";
import CodeQuestionCreated from "pages/lecturer/CodeQuestionManagement/Create";
import CodeQuestionDetails from "pages/lecturer/CodeQuestionManagement/Details";
import ExamCreated from "pages/lecturer/ExamManagemenent/CreateExam";
import QuestionBankManagement from "pages/lecturer/QuestionBankManagement";
import QuestionListOfCourse from "pages/lecturer/QuestionBankManagement/QuestionListOfCourse";
import QuestionCreated from "pages/lecturer/QuestionManagement/components/CreateQuestion";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements
} from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path={routes.lecturer.code_question.management} element={<CodeQuestionManagement />} />
      <Route path={routes.lecturer.code_question.create} element={<CodeQuestionCreated />} />
      <Route path={routes.user.problem.root} element={<ListProblem />} />
      <Route path={routes.user.problem.detail.root} element={<DetailProblem />} />
      <Route path={routes.user.problem.solution.share} element={<ShareSolution />} />
      <Route path={routes.user.homepage.root} element={<HomePage />} />
      <Route path={routes.user.login.root} element={<Login />} />
      <Route path={routes.user.register.root} element={<Register />} />
      <Route path={routes.user.forgot_password.root} element={<Forgotpassword />} />

      <Route path={routes.lecturer.code_question.detail} Component={CodeQuestionDetails} />

      <Route path={"/grading-pdf"} element={<CustomPdfViewer />} />

      <Route path={routes.lecturer.assignment.create} element={<AssignmentCreated />} />
      <Route path={routes.lecturer.assignment.grading} element={<AssignmentGrading />} />
      <Route path={routes.student.assignment.submit} element={<AssignmentSubmission />} />
      <Route path={routes.lecturer.exam.create} element={<ExamCreated />} />
      <Route path={routes.lecturer.course.management} element={<LecturerCourseManagement />} />

      <Route path={routes.student.course.management} element={<StudentCourseManagement />} />

      <Route path={routes.lecturer.course.detail} Component={CourseDetail} />

      <Route path={routes.student.course.detail} element={<StudentCourseDetail />} />

      <Route path={routes.student.calendar} element={<StudentEventCalendar />} />
      <Route path={routes.lecturer.calendar} element={<LecturerEventCalendar />} />

      <Route
        path={routes.lecturer.question.essay.create}
        element={<QuestionCreated qtype={qtype.essay.code} />}
        handle={{ crumbName: "default" }}
      />
      <Route
        path={routes.lecturer.question.multiple_choice.create}
        element={<QuestionCreated qtype={qtype.multiple_choice.code} />}
        handle={{ crumbName: "default" }}
      />
      <Route
        path={routes.lecturer.question.short_answer.create}
        element={<QuestionCreated qtype={qtype.short_answer.code} />}
        handle={{ crumbName: "default" }}
      />
      <Route
        path={routes.lecturer.question.true_false.create}
        element={<QuestionCreated qtype={qtype.true_false.code} />}
        handle={{ crumbName: "default" }}
      />

      <Route path={routes.user.information} element={<UserInformation />} />

      <Route path={routes.user.course_certificate.root} element={<CourseCertificates />} />
      <Route path={routes.user.contest.root} element={<ContestList />} />

      <Route
        path={routes.user.course_certificate.detail.root}
        element={<CourseCertificateDetail />}
      />
      <Route
        path={routes.user.course_certificate.detail.lesson.detail}
        element={<CourseCertificateLessonProblem />}
      />

      <Route
        path={routes.lecturer.question_bank.path}
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
                  element={<QuestionCreated qtype={value.code} />}
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
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
