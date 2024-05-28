import CustomPdfViewer from "components/pdf/CustomPdfViewer";
import SubmitAssignment from "pages/client/student/AssignmentManagement/SubmitAssignment";
import UserInformation from "pages/client/user/UserDetails/UserInformation";
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements
} from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import "./App.scss";
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
import LecturerSourceCodePlagiarismManagement from "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismOverview";
import StudentCoursesManagement from "pages/client/student";
import LecturerCoursesManagement from "pages/client/lecturer";
import UserHomepage from "pages/client/user";
import AIScoring from "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions/components/AIScoring";
import DetailAIScoring from "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions/components/AIScoring/components/DetailAIScoring";
import DetailProblem from "pages/client/user/DetailProblem";
import ShareSolution from "pages/client/user/DetailProblem/components/ListSolution/components/ShareSolution";
import LecturerSourceCodePlagiarismPairs from "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismPairs";
import LecturerSourceCodePlagiarismPairDetails from "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismPairDetails";
import LecturerSourceCodePlagiarismFileSubmissions from "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismFileSubmissions";
import LecturerSourceCodePlagiarismFileSubmissionDetails from "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismFileSubmissionDetails";
import LecturerSourceCodePlagiarismClusters from "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismClusters";
import LecturerSourceCodePlagiarismClustersDetails from "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismClustersDetails";
import GradingConfig from "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions/components/AIScoring/components/AiGradingConfig";
import CreateEssayQuestion from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateEssayQuestion";
import CreateMultichoiceQuestion from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateMultichoiceQuestion";
import CreateShortAnswerQuestion from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateShortAnswerQuestion";
import CreateTrueFalseQuestion from "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateTrueFalseQuestion";
import PersistLogin from "components/common/PersistLogin";
import { useSelector } from "react-redux";
import { selectedLoading } from "reduxes/Loading";
import LoadingScreen from "components/common/LoadingScreen";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path={routes.grading_pdf} element={<CustomPdfViewer />} />

      <Route element={<PersistLogin />}>
        <Route path={routes.user.problem.detail.root} element={<DetailProblem />} />
        <Route path={routes.user.problem.solution.share} element={<ShareSolution />} />
        <Route path={routes.user.homepage.root} element={<UserHomepage />} />
        <Route path={routes.user.root} element={<UserHomepage />} />
        <Route path={routes.user.information} element={<UserInformation />} />
      </Route>

      <Route
        path={routes.user.course_certificate.detail.lesson.detail}
        element={<DetailProblem />}
      />

      <Route
        path={routes.user.course_certificate.detail.lesson.share_solution}
        element={<ShareSolution />}
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
        path={routes.lecturer.exam.code_plagiarism_detection}
        element={<LecturerSourceCodePlagiarismManagement />}
      />
      <Route
        path={routes.lecturer.exam.code_plagiarism_detection_submissions}
        element={<LecturerSourceCodePlagiarismFileSubmissions />}
      />
      <Route
        path={routes.lecturer.exam.code_plagiarism_detection_submissions_detail}
        element={<LecturerSourceCodePlagiarismFileSubmissionDetails />}
      />
      <Route
        path={routes.lecturer.exam.code_plagiarism_detection_pairs}
        element={<LecturerSourceCodePlagiarismPairs />}
      />
      <Route
        path={routes.lecturer.exam.code_plagiarism_detection_pairs_detail}
        element={<LecturerSourceCodePlagiarismPairDetails />}
      />
      <Route
        path={routes.lecturer.exam.code_plagiarism_detection_clusters}
        element={<LecturerSourceCodePlagiarismClusters />}
      />
      <Route
        path={routes.lecturer.exam.code_plagiarism_detection_clusters_detail}
        element={<LecturerSourceCodePlagiarismClustersDetails />}
      />
      <Route
        path={routes.lecturer.question.essay.create}
        element={<CreateEssayQuestion qtype={qtype.essay.code} />}
      />
      <Route
        path={routes.lecturer.question.multiple_choice.create}
        element={<CreateMultichoiceQuestion qtype={qtype.multiple_choice.code} />}
      />
      <Route
        path={routes.lecturer.question.short_answer.create}
        element={<CreateShortAnswerQuestion qtype={qtype.short_answer.code} />}
      />
      <Route
        path={routes.lecturer.question.true_false.create}
        element={<CreateTrueFalseQuestion qtype={qtype.true_false.code} />}
      />

      <Route
        path={routes.lecturer.question.ai.create}
        element={<AIQuestionCreated />}
        handle={{ crumbName: "default" }}
      />

      <Route path={routes.lecturer.exam.ai_grading_config} element={<GradingConfig />} />
      <Route path={routes.student.root} element={<StudentCoursesManagement />} />
      <Route path={routes.student.assignment.submit} element={<SubmitAssignment />} />
      <Route path={routes.student.exam.take} element={<TakeExam />} />
      <Route path={routes.student.exam.review} element={<StudentReviewExamAttempt />} />
    </Route>
  )
);

function App() {
  const isLoading = useSelector(selectedLoading);
  return (
    <>
      {isLoading && <LoadingScreen />}
      <RouterProvider router={router} />;
    </>
  );
}

export default App;
