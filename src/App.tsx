import CustomPdfViewer from "components/pdf/CustomPdfViewer";
import SubmitAssignment from "pages/client/student/AssignmentManagement/SubmitAssignment";
import ContestList from "pages/client/user/Contest/ContestList";
import CourseCertificates from "pages/client/user/CourseCertificate";
import ListProblem from "pages/client/user/ListProblem";
import UserInformation from "pages/client/user/UserDetails/UserInformation";
import QuestionCreated from "pages/client/lecturer/QuestionManagement/components/CreateQuestion";
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements
} from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import "./App.scss";
import CourseCertificateLessonProblem from "pages/client/user/CourseCertificate/Detail/DetailProblem";
import ShareSolution from "pages/client/user/ListProblem/components/DetailProblem/components/ListSolution/components/ShareSolution";
import DetailProblem from "pages/client/user/ListProblem/components/DetailProblem";
import LessonShareSolution from "pages/client/user/CourseCertificate/Detail/DetailProblem/components/ListSolution/components/ShareSolution";
import AssignmentCreated from "pages/client/lecturer/AssignmentManagement/CreateAssigment";
import AssignmentGrading from "pages/client/lecturer/AssignmentManagement/GradingAssignment";
import CreateExam from "pages/client/lecturer/ExamManagemenent/CreateExam";
import PreviewAssignmentSubmission from "pages/client/lecturer/AssignmentManagement/PreviewAssignmentSubmission";
import PreviewExam from "pages/client/lecturer/ExamManagemenent/PreviewExam";
import GradingExam from "pages/client/lecturer/ExamManagemenent/GradingExam";
import ReviewExamAttempt from "pages/client/lecturer/ExamManagemenent/ReviewExamAttempt";
import StudentReviewExamAttempt from "pages/client/student/ExamManagemenent/ReviewExamAttempt";
import TakeExam from "pages/client/student/ExamManagemenent/TakeExam";
import AIQuestionCreated from "pages/client/lecturer/QuestionManagement/components/AICreateQuestion";
import LecturerSourceCodePlagiarismManagement from "pages/client/lecturer/SourceCodePlagiarismManagement";
import StudentCoursesManagement from "pages/client/student";
import LecturerCoursesManagement from "pages/client/lecturer";
import UserHomepage from "pages/client/user";
import AIScoring from "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions/components/AIScoring";
import DetailAIScoring from "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions/components/AIScoring/components/DetailAIScoring";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path={routes.grading_pdf} element={<CustomPdfViewer />} />

      <Route path={routes.user.problem.detail.root} element={<DetailProblem />} />
      <Route path={routes.user.problem.solution.share} element={<ShareSolution />} />
      <Route path={routes.user.homepage.root} element={<UserHomepage />} />
      <Route path={routes.user.root} element={<UserHomepage />} />
      <Route path={routes.user.information} element={<UserInformation />} />

      <Route
        path={routes.user.course_certificate.detail.lesson.detail}
        element={<CourseCertificateLessonProblem />}
      />

      <Route
        path={routes.user.course_certificate.detail.lesson.share_solution}
        element={<LessonShareSolution />}
      />

      <Route path={routes.lecturer.root} element={<LecturerCoursesManagement />} />
      <Route path={routes.lecturer.assignment.create} element={<AssignmentCreated />} />
      <Route path={routes.lecturer.assignment.grading} element={<AssignmentGrading />} />
      <Route
        path={routes.lecturer.exam.code_plagiarism_detection}
        element={<LecturerSourceCodePlagiarismManagement />}
      />
      <Route path={routes.lecturer.exam.ai_scroring} element={<AIScoring />} />
      <Route path={routes.lecturer.exam.ai_scroring_detail} element={<DetailAIScoring />} />
      <Route
        path={routes.lecturer.assignment.preview_submit}
        element={<PreviewAssignmentSubmission />}
      />
      <Route path={routes.lecturer.exam.create} element={<CreateExam />} />
      <Route path={routes.lecturer.exam.preview} element={<PreviewExam />} />
      <Route path={routes.lecturer.exam.grading} element={<GradingExam />} />
      <Route path={routes.lecturer.exam.review} element={<ReviewExamAttempt />} />
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

      {"AI Crete question"}
      <Route
        path={routes.lecturer.question.ai.create}
        element={<AIQuestionCreated />}
        handle={{ crumbName: "default" }}
      />

      <Route path={routes.student.root} element={<StudentCoursesManagement />} />
      <Route path={routes.student.assignment.submit} element={<SubmitAssignment />} />
      <Route path={routes.student.exam.take} element={<TakeExam />} />
      <Route path={routes.student.exam.review} element={<StudentReviewExamAttempt />} />
    </Route>
  )
);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
