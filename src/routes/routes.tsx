import StudentCourseDetail from "pages/client/student/CourseDetail";
import StudentCourseGrade from "pages/client/student/CourseGrade";
import StudentCourseParticipant from "pages/client/student/CourseParticipant";

export const routes = {
  lecturer: {
    assignment_management: "/lecturer/assignment-management",
    course: {
      management: "/lecturer/courses",
      detail: "/lecturer/courses/:courseId/*",
      information: "/lecturer/courses/:courseId/information",
      assignment: "/lecturer/courses/:courseId/assignment",
      grade: "/lecturer/courses/:courseId/grade",
      participant: "/lecturer/courses/:courseId/participant"
    },
    code_question: {
      management: "/lecturer/code-questions",
      create: "/lecturer/code-questions/create",
      detail: "/lecturer/code-questions/edit/:id/*",
      information: "/lecturer/code-questions/edit/:id/information",
      test_cases: "/lecturer/code-questions/edit/:id/test-cases",
      code_stubs: "/lecturer/code-questions/edit/:id/code-stubs",
      languages: "/lecturer/code-questions/edit/:id/languages"
    },
    assignment: {
      create: "/lecturer/assignment-management/create",
      grading: "/lecturer/assignment-management/grading"
    },
    question: {
      essay: {
        create: "/lecturer/question-management/essay/create"
      },
      multiple_choice: {
        create: "/lecturer/question-management/multiple-choice/create"
      },
      short_answer: {
        create: "/lecturer/question-management/short-answer/create"
      },
      true_false: {
        create: "/lecturer/question-management/true-false/create"
      }
    },
    question_bank: {
      path: "lecturer/question-bank-management"
    },
    exam: {
      create: "/lecturer/exam-management/create"
    }
  },
  user: {
    problem: {
      list: "/problems",
      detail: "/problems/:id"
    },
    assignment: {
      submission: "/assignments/:assignmentId/submission"
    },
    course: {
      detail: { path: "student/courses/:id/detail", Component: StudentCourseDetail },
      grade: { path: "student/courses/:id/grade", Component: StudentCourseGrade },
      participant: { path: "student/courses/:id/participant", Component: StudentCourseParticipant }
    }
  }
};
