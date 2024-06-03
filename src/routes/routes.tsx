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
      detail: "/lecturer/code-questions/edit/:questionId/*",
      information: "/lecturer/code-questions/edit/:questionId/information",
      test_cases: "/lecturer/code-questions/edit/:questionId/test-cases",
      code_stubs: "/lecturer/code-questions/edit/:questionId/code-stubs",
      languages: "/lecturer/code-questions/edit/:questionId/languages"
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
        path: ":categoryId"
      },
      create_question: {
        paths: Object.values(qtype)
          .map((value) => value.code)
          .map((code) => ({
            path: `:categoryId/${code === "ai" ? "ai/create" : `create/${code}`}`,
            code
          }))
      },
      update_question: {
        paths: Object.values(qtype)
          .map((value) => value.code)
          .map((code) => ({
            path: `:categoryId/update/${code}`,
            code
          }))
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
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection/reports/:reportId",
      code_plagiarism_detection_submissions:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection/reports/:reportId/submissions",
      code_plagiarism_detection_submissions_detail:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection/reports/:reportId/submissions/:submissionId",
      code_plagiarism_detection_clusters:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection/reports/:reportId/clusters",
      code_plagiarism_detection_clusters_detail:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection/reports/:reportId/clusters/:clusterId",
      code_plagiarism_detection_pairs:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection/reports/:reportId/pairs",
      code_plagiarism_detection_pairs_detail:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/code-plagiarism-detection/reports/:reportId/pairs/:pairId",
      ai_scroring: "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/ai-scoring",
      ai_scroring_detail:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submissions/ai-scoring/:submissionId",
      ai_grading_config:
        "/lecturer/courses/:courseId/assignments/exams/:examId/submisions/ai-grading-config"
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
      root: "/forgot-password",
      verify_otp: "/forgot-password/verify-otp",
      reset_password: "/forgot-password/reset-password"
    }
  },
  admin: {
    contest: {
      root: "/admin/contests",
      edit: {
        root: "/admin/contests/edit/:contestId/*",
        details: "/admin/contests/edit/:contestId/details",
        problems: "/admin/contests/edit/:contestId/problems",
        advanced_settings: "/admin/contests/edit/:contestId/advanced-settings",
        signups: "/admin/contests/edit/:contestId/signups",
        statistics: "/admin/contests/edit/:contestId/statistics"
      },
      create: "/admin/contests/create"
    }
  },
  grading_pdf: "/grading-pdf"
};
