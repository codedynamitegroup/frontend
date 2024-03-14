import qtype from "utils/constant/Qtype";

export const routes = {
  lecturer: {
    root: "/lecturer/*",
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
      submissions: "/lecturer/courses/:courseId/assignments/:assignmentId/submissions",
      preview_submit: "/lecturer/courses/:courseId/assignments/:assignmentId/preview-submit"
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
      },
      ai: {
        create: "/lecturer/questions/ai/create"
      }
    },
    question_bank: {
      path: "/lecturer/question-bank-management",
      questions_list_of_category: {
        path: ":categoryId",
        create_question: {
          paths: Object.values(qtype)
            .map((value) => value.code)
            .map((code) => ({
              path: `${code === "ai" ? "ai/create" : `create/${code}`}`,
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
      create: "/lecturer/courses/:courseId/assignments/exams/create",
      detail: "/lecturer/courses/:courseId/assignments/exams/:examId",
      grading:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/:submissionId/grading",
      submissions: "/lecturer/courses/:courseId/assignments/exams/:examId/submissions",
      preview: "/lecturer/courses/:courseId/assignments/exams/:examId/preview",
      review: "/lecturer/courses/:courseId/assignments/exams/:examId/review",
      code_plagiarism_detection:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection",
      code_plagiarism_detection_file_pairs:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection/file-pairs",
      code_plagiarism_detection_file_pairs_detail:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection/file-pairs/:filePairId"
    }
  },
  student: {
    root: "/student/*",
    course: {
      management: "/student/courses",
      detail: "/student/courses/:courseId/*",
      information: "/student/courses/:courseId/information",
      assignment: "/student/courses/:courseId/assignments",
      assignment_detail: "/student/courses/:courseId/assignments/:assignmentId",
      grade: "/student/courses/:courseId/grade",
      participant: "/student/courses/:courseId/participant"
    },
    assignment: {
      detail: "/student/courses/:courseId/assignments/:assignmentId",
      submit: "/student/courses/:courseId/assignments/:assignmentId/submit"
    },
    exam: {
      detail: "/student/courses/:courseId/assignments/exams/:examId",
      take: "/student/courses/:courseId/assignments/exams/:examId/take",
      review: "/student/courses/:courseId/assignments/exams/:examId/review"
    },
    calendar: "/student/calendar"
  },
  user: {
    root: "/*",
    information: "/user/information",
    password_change: "/user/password/change",
    problem: {
      solution: {
        share: "/problems/:problemId/solution/share"
      },
      root: "/problems",
      detail: {
        root: "/problems/:problemId/*",
        description: "/problems/:problemId/description",
        solution: "/problems/:problemId/solution",
        submission: "/problems/:problemId/submission"
      }
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
          submission: "/course-certificates/:courseId/lesson/:lessonId/submission",
          share_solution: "/course-certificates/:courseId/lesson/:lessonId/share-solution"
        },
        certificate: "/course-certificates/:courseId/certificate"
      }
    },
    contest: {
      root: "/contests",
      detail: "/contests/:contestId"
    },
    homepage: {
      root: "/"
    },
    dashboard: {
      root: "/home"
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
  },
  grading_pdf: "/grading-pdf"
};
