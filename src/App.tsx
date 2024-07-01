import RequireAuth from "components/common/RequireAuth";
import { ERoleName } from "models/authService/entity/role";
import LecturerCodeQuestionCreation from "pages/client/lecturer/CodeQuestionManagement/Create";
import SubmitAssignment from "pages/client/student/AssignmentManagement/SubmitAssignment";
import TakeContestProblem from "pages/client/user/Contest/TakeContestProblem";
import Lessons from "pages/client/user/CourseCertificate/Lessons";
import OrganizationAdminHomepage from "pages/org_admin";
import React, { lazy } from "react";
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements
} from "react-router-dom";
import { routes } from "routes/routes";
import qtype from "utils/constant/Qtype";
import "./App.scss";
import ScrollToTop from "components/ScrollTop";

const EditEssayQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/ExamManagemenent/EditExam/components/EditQuestion/EditEssayQuestion"
    )
);
const EditMultichoiceQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/ExamManagemenent/EditExam/components/EditQuestion/EditMultichoiceQuestion"
    )
);
const EditShortAnswerQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/ExamManagemenent/EditExam/components/EditQuestion/EditShortAnswerQuestion"
    )
);
const EditTrueFalseQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/ExamManagemenent/EditExam/components/EditQuestion/EditTrueFalseQuestion"
    )
);

const AssignmentCreated = lazy(
  () => import("pages/client/lecturer/AssignmentManagement/CreateAssigment")
);
const AssignmentUpdated = lazy(
  () => import("pages/client/lecturer/AssignmentManagement/CreateAssigment")
);
const AssignmentGrading = lazy(
  () => import("pages/client/lecturer/AssignmentManagement/GradingAssignment")
);
const CreateExam = lazy(() => import("pages/client/lecturer/ExamManagemenent/CreateExam"));
const EditExam = lazy(() => import("pages/client/lecturer/ExamManagemenent/EditExam"));
const PreviewAssignmentSubmission = lazy(
  () => import("pages/client/lecturer/AssignmentManagement/PreviewAssignmentSubmission")
);
const PreviewExam = lazy(() => import("pages/client/lecturer/ExamManagemenent/PreviewExam"));
const GradingExam = lazy(() => import("pages/client/lecturer/ExamManagemenent/GradingExam"));
const LecturerReviewExamAttempt = lazy(
  () => import("pages/client/lecturer/ExamManagemenent/ReviewExamAttempt")
);
const StudentReviewExamAttempt = lazy(
  () => import("pages/client/student/ExamManagemenent/ReviewExamAttempt")
);
const TakeExam = lazy(() => import("pages/client/student/ExamManagemenent/TakeExam"));
const AIQuestionCreated = lazy(
  () => import("pages/client/lecturer/QuestionManagement/components/AICreateQuestion")
);
const LecturerSourceCodePlagiarismManagement = lazy(
  () => import("pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismOverview")
);
const StudentCoursesManagement = lazy(() => import("pages/client/student"));
const LecturerCoursesManagement = lazy(() => import("pages/client/lecturer"));
const UserHomepage = lazy(() => import("pages/client/user"));
const AIScoring = lazy(
  () =>
    import(
      "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions/components/AIScoring"
    )
);
const DetailAIScoring = lazy(
  () =>
    import(
      "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions/components/AIScoring/components/DetailAIScoring"
    )
);
const ShareSolution = lazy(
  () => import("pages/client/user/DetailProblem/components/ListSolution/components/ShareSolution")
);
const LecturerSourceCodePlagiarismPairs = lazy(
  () => import("pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismPairs")
);
const LecturerSourceCodePlagiarismPairDetails = lazy(
  () =>
    import("pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismPairDetails")
);
const LecturerSourceCodePlagiarismFileSubmissions = lazy(
  () =>
    import(
      "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismFileSubmissions"
    )
);
const LecturerSourceCodePlagiarismFileSubmissionDetails = lazy(
  () =>
    import(
      "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismFileSubmissionDetails"
    )
);
const LecturerSourceCodePlagiarismClusters = lazy(
  () => import("pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismClusters")
);
const LecturerSourceCodePlagiarismClustersDetails = lazy(
  () =>
    import(
      "pages/client/lecturer/SourceCodePlagiarismManagement/SourceCodePlagiarismClustersDetails"
    )
);
const GradingConfig = lazy(
  () =>
    import(
      "pages/client/lecturer/CourseManagement/Details/components/ExamSubmissions/components/AIScoring/components/AiGradingConfig"
    )
);
const CreateEssayQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateEssayQuestion"
    )
);
const CreateMultichoiceQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateMultichoiceQuestion"
    )
);
const CreateShortAnswerQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateShortAnswerQuestion"
    )
);
const CreateTrueFalseQuestion = lazy(
  () =>
    import(
      "pages/client/lecturer/QuestionManagement/components/CreateQuestion/components/CreateTrueFalseQuestion"
    )
);
const PersistLogin = lazy(() => import("components/common/PersistLogin"));
const SocketConnection = lazy(() => import("components/common/SocketConnection"));
const SubmitExamSummary = lazy(
  () => import("pages/client/student/ExamManagemenent/SubmitExamReview")
);
const TakeExamLecturer = lazy(() => import("pages/client/lecturer/ExamManagemenent/TakeExam"));
const SubmitExamSummaryLecturer = lazy(
  () => import("pages/client/lecturer/ExamManagemenent/SubmitExamReview")
);
const SystemAdminHomepage = lazy(() => import("pages/admin"));
const DetailProblem = lazy(() => import("pages/client/user/DetailProblem"));

const router = createHashRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route element={<PersistLogin />}>
        <Route element={<ScrollToTop />}>
          <Route element={<SocketConnection />}>
            <Route path={routes.user.problem.detail.root} element={<DetailProblem />} />
            <Route path={routes.user.problem.solution.share} element={<ShareSolution />} />
            <Route path={routes.user.homepage.root} element={<UserHomepage />} />
            <Route path={routes.user.root} element={<UserHomepage />} />

            <Route
              path={routes.user.course_certificate.detail.lesson.share_solution}
              element={<ShareSolution />}
            />

            <Route element={<RequireAuth availableRoles={[ERoleName.LECTURER_MOODLE]} />}>
              <Route
                path={routes.lecturer.exam.edit_essay_question}
                element={<EditEssayQuestion qtype={qtype.essay.code} />}
              />
              <Route
                path={routes.lecturer.exam.edit_multi_question}
                element={<EditMultichoiceQuestion qtype={qtype.multiple_choice.code} />}
              />
              <Route
                path={routes.lecturer.exam.edit_short_question}
                element={<EditShortAnswerQuestion qtype={qtype.short_answer.code} />}
              />
              <Route
                path={routes.lecturer.exam.edit_true_false_question}
                element={<EditTrueFalseQuestion qtype={qtype.true_false.code} />}
              />

              <Route path={routes.lecturer.root} element={<LecturerCoursesManagement />} />
              <Route path={routes.lecturer.assignment.create} element={<AssignmentCreated />} />
              <Route path={routes.lecturer.assignment.edit} element={<AssignmentUpdated />} />
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
              <Route path={routes.lecturer.exam.take} element={<TakeExamLecturer />} />
              <Route
                path={routes.lecturer.exam.submitSummary}
                element={<SubmitExamSummaryLecturer />}
              />
              <Route path={routes.lecturer.exam.edit} element={<EditExam />} />
              <Route path={routes.lecturer.exam.preview} element={<PreviewExam />} />
              <Route path={routes.lecturer.exam.grading} element={<GradingExam />} />
              <Route path={routes.lecturer.exam.review} element={<LecturerReviewExamAttempt />} />
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

              {/*  question bank */}
              <Route
                path={routes.lecturer.question_bank.create_question.essay.create}
                element={<CreateEssayQuestion qtype={qtype.essay.code} />}
              />
              <Route
                path={routes.lecturer.question_bank.create_question.multiple_choice.create}
                element={<CreateMultichoiceQuestion qtype={qtype.multiple_choice.code} />}
              />
              <Route
                path={routes.lecturer.question_bank.create_question.short_answer.create}
                element={<CreateShortAnswerQuestion qtype={qtype.short_answer.code} />}
              />
              <Route
                path={routes.lecturer.question_bank.create_question.true_false.create}
                element={<CreateTrueFalseQuestion qtype={qtype.true_false.code} />}
              />
              <Route
                path={routes.lecturer.question_bank.create_question.code.create}
                element={<LecturerCodeQuestionCreation />}
              />

              <Route
                path={routes.lecturer.question.ai.create}
                element={<AIQuestionCreated />}
                handle={{ crumbName: "default" }}
              />

              <Route path={routes.lecturer.exam.ai_grading_config} element={<GradingConfig />} />
            </Route>
            <Route element={<RequireAuth availableRoles={[ERoleName.STUDENT_MOODLE]} />}>
              <Route path={routes.student.root} element={<StudentCoursesManagement />} />
              <Route path={routes.student.assignment.submit} element={<SubmitAssignment />} />
              <Route path={routes.student.assignment.edit_submit} element={<SubmitAssignment />} />
              <Route path={routes.student.exam.take} element={<TakeExam />} />
              <Route path={routes.student.exam.submitSummary} element={<SubmitExamSummary />} />
              <Route path={routes.student.exam.review} element={<StudentReviewExamAttempt />} />
            </Route>

            <Route element={<RequireAuth availableRoles={[ERoleName.ADMIN]} />}>
              <Route path={routes.admin.homepage.root} element={<SystemAdminHomepage />} />
            </Route>
            <Route element={<RequireAuth availableRoles={[ERoleName.ADMIN_MOODLE]} />}>
              <Route
                path={routes.org_admin.homepage.root}
                element={<OrganizationAdminHomepage />}
              />
            </Route>

            <Route
              path={routes.user.course_certificate.detail.lesson.detail}
              element={<Lessons />}
            />

            <Route
              path={routes.user.contest.detail.problems.problem_root}
              element={<TakeContestProblem />}
            />
          </Route>
        </Route>
      </Route>
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
