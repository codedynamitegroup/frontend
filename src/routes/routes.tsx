import qtype from "utils/constant/Qtype";

export const routes = {
  lecturer: {
    calendar: "/lecturer/calendar",
    course: {
      management: "/lecturer/courses",
      detail: "/lecturer/courses/:courseId/*",
      information: "/lecturer/courses/:courseId/information",
      assignment: "/lecturer/courses/:courseId/assignments",
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
      detail: "/lecturer/courses/:courseId/assignments/:assignmentId",
      create: "/lecturer/courses/:courseId/assignments/create",
      grading:
        "/lecturer/courses/:courseId/assignments/:assignmentId/submissions/:submissionId/grading",
      submissions: "/lecturer/courses/:courseId/assignments/:assignmentId/submissions"
    },
    question: {
      essay: {
        create: "/lecturer/questions/essay/create"
      },
      multiple_choice: {
        create: "/lecturer/questions/multiple-choice/create"
      },
      short_answer: {
        create: "/lecturer/questions/short-answer/create"
      },
      true_false: {
        create: "/lecturer/questions/true-false/create"
      }
    },
    question_bank: {
      path: "lecturer/question-bank-management",
      questions_list_of_category: {
        path: ":categoryId",
        create_question: {
          paths: Object.values(qtype)
            .map((value) => value.code)
            .map((code) => ({
              path: `create/${code}`,
              code
            }))
        },
        update_question: {
          paths: Object.values(qtype)
            .map((value) => value.code)
            .map((code) => ({
              path: `update/${code}`,
              code
            }))
        }
      }
    },
    exam: {
      create: "/lecturer/exam-management/create"
    }
  },
  student: {
    course: {
      management: "/student/courses",
      detail: "/student/courses/:courseId/*",
      information: "/student/courses/:courseId/information",
      assignment: "/student/courses/:courseId/assignment",
      grade: "/student/courses/:courseId/grade",
      participant: "/student/courses/:courseId/participant"
    },
    assignment: {
      submit: "/student/courses/:courseId/assignments/:assignmentId/submit"
    },
    calendar: "/student/calendar"
  },
  user: {
    information: "/user/information",
    password_change: "/user/password/change",
    problem: {
      solution: {
        share: "/problems/:id/solution/share"
      },
      root: "/problems",
      detail: "/problems/:id"
    },
    course_certificate: {
      root: "/course-certificates",
      detail: {
        root: "/course-certificates/:courseId/*",
        introduction: "/course-certificates/:courseId/introduction",
        lesson: {
          root: "/course-certificates/:courseId/lesson",
          detail: "/course-certificates/:courseId/lesson/:lessonId/*",
          description: "/course-certificates/:courseId/lesson/:lessonId/description",
          solution: "/course-certificates/:courseId/lesson/:lessonId/solution",
          submission: "/course-certificates/:courseId/lesson/:lessonId/submission"
        },
        certificate: "/course-certificates/:courseId/certificate"
      }
    },
    contest: {
      root: "/contests",
      detail: "/contests/:contestId",
      participant: "/contests/:contestId/participant",
      leaderboard: "/contests/:contestId/leaderboard",
      submission: "/contests/:contestId/submission"
    },
    homepage: {
      root: "/"
    },
    dashboard: {
      root: "/dashboard"
    },
    login: {
      root: "/login"
    },
    register: {
      root: "/register"
    },
    forgot_password: {
      root: "/forgot-password"
    }
  }
};
