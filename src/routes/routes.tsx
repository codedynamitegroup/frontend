import LecturerCourseDetail from "pages/client/lecturer/CourseDetail";
import LecturerCourseGrade from "pages/client/lecturer/CourseGrade";
import LecturerCourseManagement from "pages/client/lecturer/CourseManagement";
import LecturerCourseParticipant from "pages/client/lecturer/CourseParticipant";
import StudentCourseDetail from "pages/client/student/CourseDetail";
import StudentCourseGrade from "pages/client/student/CourseGrade";

export const routes = {
  lecturer: {
    code_management: "/lecturer/code-management",
    assignment_management: "/lecturer/assignment-management",
    course_management: {
      path: "/lecturer/course-management",
      Component: LecturerCourseManagement
    },
    course: {
      detail: { path: "/lecturer/course/:courseId/detail", Component: LecturerCourseDetail },
      assignment: { path: "/lecturer/course/:courseId/assignment" },
      grade: { path: "/lecturer/course/:courseId/grade", Component: LecturerCourseGrade },
      participant: {
        path: "/lecturer/course/:courseId/participant",
        Component: LecturerCourseParticipant
      }
    },
    code_question: {
      management: "/lecturer/code-management",
      create: "/lecturer/code-management/create",
      details: "/lecturer/code-management/edit/:id/*",
      information: "/lecturer/code-management/edit/:id/information",
      test_cases: "/lecturer/code-management/edit/:id/test-cases",
      code_stubs: "/lecturer/code-management/edit/:id/code-stubs",
      languages: "/lecturer/code-management/edit/:id/languages"
    },
    assignment: {
      create: "/lecturer/assignment-management/create",
      grading: "/lecturer/assignment-management/grading"
    },
    question: {
      essay: {
        create: "/lecturer/question-management/essay/create"
      }
    },
    exam: {
      create: "/lecturer/exam-management/create"
    }
  },
  user: {
    problem: {
      list: "/problem",
      detail: "/problem/:name"
    },
    assignment: {
      submission: "/assignments/:assignmentId/submission"
    },
    course: {
      detail: { path: "student/courses/:id/detail", Component: StudentCourseDetail },
      grade: { path: "student/courses/:id/grade", Component: StudentCourseGrade }
    }
  }
};
