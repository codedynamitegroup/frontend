import qtype from "utils/constant/Qtype";

export const routes = {
  general: {
    notFound: "*",
    forbidden: "/forbidden"
  },
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
      edit: "/lecturer/courses/:courseId/assignments/edit/:assignmentId",
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
      detail: "/lecturer/question-bank-management/:categoryId",
      questions_list_of_category: {
        path: ":categoryId"
      },
      create_question: {
        essay: {
          create: "/lecturer/question-bank-management/:categoryId/create/essay"
        },
        multiple_choice: {
          create: "/lecturer/question-bank-management/:categoryId/create/multiple-choice"
        },
        short_answer: {
          create: "/lecturer/question-bank-management/:categoryId/create/short-answer"
        },
        true_false: {
          create: "/lecturer/question-bank-management/:categoryId/create/true-false"
        },
        code: {
          create: "/lecturer/question-bank-management/:categoryId/create/code"
        },
        ai: {
          create: "/lecturer/question-bank-management/:categoryId/create/ai"
        },
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
      take: "/lecturer/courses/:courseId/assignments/exams/:examId/take",
      submitSummary: "/lecturer/courses/:courseId/assignments/exams/:examId/summary",
      edit: "/lecturer/courses/:courseId/assignments/exams/:examId/edit",
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
      root: "/student/courses/*",
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
      submit: "/student/courses/:courseId/assignments/:assignmentId/submit",
      edit_submit: "/student/courses/:courseId/assignments/:assignmentId/submit/edit"
    },
    exam: {
      detail: "/student/courses/:courseId/assignments/exams/:examId",
      take: "/student/courses/:courseId/assignments/exams/:examId/take",
      review: "/student/courses/:courseId/assignments/exams/:examId/review/:submissionId",
      submitSummary: "/student/courses/:courseId/assignments/exams/:examId/summary"
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
      root: "/certificate-courses",
      detail: {
        root: "/certificate-courses/:courseId/*",
        introduction: "/certificate-courses/:courseId/introduction",
        lesson: {
          root: "/certificate-courses/:courseId/lesson",
          detail: "/certificate-courses/:courseId/lesson/:lessonId/*",
          description: "/certificate-courses/:courseId/lesson/:lessonId/description",
          solution: "/certificate-courses/:courseId/lesson/:lessonId/solution",
          submission: "/certificate-courses/:courseId/lesson/:lessonId/submission",
          share_solution: "/certificate-courses/:courseId/lesson/:lessonId/share-solution"
        },
        certificate: "/certificate-courses/:courseId/certificate",
        review: "/certificate-courses/:courseId/review"
      }
    },
    business_contact: {
      root: "/business-contact"
    },
    contest: {
      root: "/contests",
      detail: {
        root: "/contests/:contestId/*",
        information: "/contests/:contestId/information",
        problems: {
          root: "/contests/:contestId/problems",
          detail: "/contests/:contestId/problems/:problemId",
          problem_root: "/contests/:contestId/problems/:problemId/*",
          description: "/contests/:contestId/problems/:problemId/description",
          solution: "/contests/:contestId/problems/:problemId/solution",
          submission: "/contests/:contestId/problems/:problemId/submission",
          share_solution: "/contests/:contestId/problems/:problemId/share-solution"
        },
        leaderboard: "/contests/:contestId/leaderboard"
      }
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
    homepage: {
      root: "/admin/*"
    },
    dashboard: "/admin/dashboard",
    information: "/admin/information",
    certificate: {
      root: "/admin/certificate-course",
      create: "/admin/certificate-course/create",
      detail: "/admin/certificate-course/:id"
    },
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
      create: "/admin/contests/create",
      submissions: "/admin/contests/:contestId/submissions",
      submission_detail: "/admin/contests/:contestId/submissions/:submissionId"
    },
    users: {
      root: "/admin/users",
      edit: {
        root: "/admin/users/edit/:userId/*",
        details: "/admin/users/edit/:userId/details"
      },
      create: "/admin/users/create"
    },
    organizations: {
      root: "/admin/organizations",
      edit: {
        root: "/admin/organizations/edit/:organizationId/*",
        details: "/admin/organizations/edit/:organizationId/details",
        list_users: "/admin/organizations/edit/:organizationId/users",
        create_user: "/admin/organizations/edit/:organizationId/users/create",
        assign_user: "/admin/organizations/edit/:organizationId/users/assign-user",
        edit_user: "/admin/organizations/edit/:organizationId/users/:userId"
      },
      create: "/admin/organizations/create"
    },
    code_question: {
      root: "/admin/code-questions",
      create: "/admin/code-questions/create",
      detail: "/admin/code-questions/edit/:questionId/*",
      information: "/admin/code-questions/edit/:questionId/information",
      test_cases: "/admin/code-questions/edit/:questionId/test-cases",
      code_stubs: "/admin/code-questions/edit/:questionId/code-stubs",
      languages: "/admin/code-questions/edit/:questionId/languages"
    },
    question_bank: {
      root: "/admin/question-bank-management",
      detail: "/admin/question-bank-management/:categoryId",
      questions_list_of_category: {
        path: ":categoryId"
      },
      create_question: {
        essay: {
          create: "/admin/question-bank-management/:categoryId/create/essay"
        },
        multiple_choice: {
          create: "/admin/question-bank-management/:categoryId/create/multiple-choice"
        },
        short_answer: {
          create: "/admin/question-bank-management/:categoryId/create/short-answer"
        },
        true_false: {
          create: "/admin/question-bank-management/:categoryId/create/true-false"
        },
        code: {
          create: "/admin/question-bank-management/:categoryId/create/code"
        },
        ai: {
          create: "/admin/question-bank-management/:categoryId/create/ai"
        },
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
    }
  },
  org_admin: {
    homepage: {
      root: "/org-admin/*"
    },
    information: "/org-admin/information",
    users: {
      root: "/org-admin/users",
      edit: {
        root: "/org-admin/users/edit/:userId/*",
        details: "/org-admin/users/edit/:userId/details"
      }
    },
    question_bank: {
      root: "/org-admin/question-bank-management",
      detail: "/org-admin/question-bank-management/:categoryId",
      questions_list_of_category: {
        path: ":categoryId"
      },
      create_question: {
        essay: {
          create: "/org-admin/question-bank-management/:categoryId/create/essay"
        },
        multiple_choice: {
          create: "/org-admin/question-bank-management/:categoryId/create/multiple-choice"
        },
        short_answer: {
          create: "/org-admin/question-bank-management/:categoryId/create/short-answer"
        },
        true_false: {
          create: "/org-admin/question-bank-management/:categoryId/create/true-false"
        },
        code: {
          create: "/org-admin/question-bank-management/:categoryId/create/code"
        },
        ai: {
          create: "/org-admin/question-bank-management/:categoryId/create/ai"
        },
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
    contest: {
      root: "/org-admin/contests",
      edit: {
        root: "/org-admin/contests/edit/:contestId/*",
        details: "/org-admin/contests/edit/:contestId/details",
        problems: "/org-admin/contests/edit/:contestId/problems",
        advanced_settings: "/org-admin/contests/edit/:contestId/advanced-settings",
        signups: "/org-admin/contests/edit/:contestId/signups",
        statistics: "/org-admin/contests/edit/:contestId/statistics"
      },
      create: "/org-admin/contests/create",
      submissions: "/org-admin/contests/:contestId/submissions",
      submission_detail: "/admin/contests/:contestId/submissions/:submissionId"
    }
  }
};
