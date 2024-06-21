export const API = {
  CORE: {
    CERTIFICATE_COURSE: {
      DEFAULT: "/core/certificate-courses",
      MY_COURSES: "/core/certificate-courses/me",
      MOST_ENROLLED: "/core/certificate-courses/most-enrolled",
      GET_BY_ID: "/core/certificate-courses/:id",
      UPDATE_BY_ID: "/core/certificate-courses/:id",
      DELETE_BY_ID: "/core/certificate-courses/:id",
      REGISTER_BY_ID: "/core/certificate-courses/:id/register",
      GET_STATISTICS: "/core/certificate-courses/certificate/dashboard-statistics",
      GET_ALL_WITH_PAGE: "/core/certificate-courses/admin/certificate/all",
      CREATE_FULL: "core/certificate-courses/create"
    },
    TOPIC: {
      DEFAULT: "/core/topics",
      GET_BY_ID: "/core/topics/:id",
      UPDATE_BY_ID: "/core/topics/:id",
      DELETE_BY_ID: "/core/topics/:id"
    },
    REVIEW: {
      DEFAULT: "/core/reviews",
      CREATE: "/core/reviews/create",
      COUNT_BY_CERTIFICATE_COURSE_ID: "/core/reviews/stars"
    },
    CHAPTER: {
      DEFAULT: "/core/chapters?certificateCourseId=:certificateCourseId",
      GET_BY_ID: "/core/chapters/:id",
      UPDATE_BY_ID: "/core/chapters/:id",
      DELETE_BY_ID: "/core/chapters/:id",
      MARK_VIEWED_BY_CHAPTER_RESOURCE_ID: "/core/chapters/chapter-resource-users/:id"
    },
    CONTEST: {
      DEFAULT: "/core/contests",
      MY_CONTEST: "/core/contests/me",
      CONTEST_MANAGEMENT_FOR_ADMIN: "/core/contests/admin",
      CONTEST_MANAGEMENT_FOR_ORG_ADMIN: "/core/contests/org-admin",
      CREATE: "/core/contests/create",
      GET_BY_ID: "/core/contests/:id",
      UPDATE_BY_ID: "/core/contests/:id",
      DELETE_BY_ID: "/core/contests/:id",
      REGISTER_BY_ID: "/core/contests/:id/register",
      MOST_POPULAR: "/core/contests/popular",
      LEADERBOARD: "/core/contests/:id/leaderboard",
      GET_USERS_OF_CONTEST: "/core/contests/:id/users",
      JOIN_CONTEST: "/core/contests/:id/register",
      ADMIN_CONTEST_STATISTICS: "/core/contests/contest/dashboard-statistics",
      ADMIN_CONTEST_DETAILS_STATISTICS: "/core/contests/:id/admin/statistics"
    },
    QUESTION: {
      DEFAULT: "/core/questions",
      CLONE: "/core/questions/clone",
      GET_BY_CATEGORY_ID: "/core/questions/category/:categoryId",
      GET_BY_ID: "/core/questions/:id",
      UPDATE_BY_ID: "/core/questions/:id",
      DELETE_BY_ID: "/core/questions/:id",
      QUESTION_DETAIL: "/core/questions/detail",
      GET_ALL_WITH_PAGINATION: "/core/questions/admin/all",
      SHORT_ANSWER_QUESTION: {
        CREATE: "/core/questions/shortanswer-question/create",
        GET_BY_ID: "/core/questions/shortanswer-question/:id",
        GET_ALL: "/core/questions/shortanswer-question"
      },
      ESSAY_QUESTION: {
        CREATE: "/core/questions/essay-question/create",
        GET_BY_ID: "/core/questions/essay-question/:id",
        GET_ALL: "/core/questions/essay-question"
      },
      MULTIPLE_CHOICE_QUESTION: {
        CREATE: "/core/questions/multichoice-question/create",
        GET_BY_ID: "questions/multichoice-question/:id",
        GET_BY_QUESTION_ID: "questions/multichoice-question/questionId/:questionId",
        GET_ALL: "/core/questions/multichoice-question"
      },
      CODE_QUESTION: {
        GET_ALL_BY_ADMIN: "/core/questions/code-question/admin",
        GET_ALL_BY_ORG_ADMIN: "/core/questions/code-question/org-admin"
      }
    }
  },
  COURSE: {
    COURSE: {
      DEFAULT: "/course/course",
      SECTION: "/course/section",
      GET_STATISTICS: "/course/course/statistics",
      GET_USER_BY_COURSE_ID: "/course/course-user/:id/user",
      COUNT_STUDENT_BY_COURSE_ID: "/course/course-user/:id/count"
    },
    COURSE_TYPE: {
      DEFAULT: "/course/course-type",
      GET_BY_ORGANIZATION_ID: "/course/course-type/:id"
    },
    COURSE_USER: {
      DEFAULT: "/course/course-user",
      GET_BY_COURSE_ID: "/course/course-user/course/:id",
      GET_BY_USER_ID: "/course/course-user/user/:id",
      GET_USER_BY_COURSE_ID: "/course/course-user/:id/user",
      COUNT_STUDENT_BY_COURSE_ID: "/course/course-user/:id/count",
      GET_ALL_COURSE_BY_USER_ID: "/course/course-user/user/:id"
    },
    ASSIGNMENT: {
      DEFAULT: "/course/assignment",
      GET_BY_ID: "/course/assignment/:id",
      LIST_SUBMISSION: "/course/assignment/list-submission/:id",
      CREATE: "/course/assignment",
      UPDATE_BY_ID: "/course/assignment/:id",
      DELETE_BY_ID: "/course/assignment/:id",
      INTRO_ATTACHMENT: "/course/assignment/intro-attachment"
    },
    SUBMISSION_ASSIGNMENT: {
      DEFAULT: "/course/submission-assignment",
      GET_BY_USER_ID_ASSIGNMENT_ID: "/course/submission-assignment/user",
      GET_BY_ID: "/course/submission-assignment/:id",
      CREATE: "/course/submission-assignment",
      UPDATE_BY_ID: "/course/submission-assignment/:id",
      DELETE_BY_ID: "/course/submission-assignment/:id",
      COUNT_TO_GRADE: "/course/submission-assignment/countToGrade",
      COUNT_ALL: "/course/submission-assignment/countAll"
    },
    SUBMISSION_ASSIGNMENT_FILE: {
      DEFAULT: "/course/submission-assignment-file",
      CREATE: "/course/submission-assignment-file",
      UPDATE_BY_ID: "/course/submission-assignment-file/:id",
      DELETE_BY_ID: "/course/submission-assignment-file/:id",
      GET_BY_ID: "/course/submission-assignment-file/:id"
    },
    SUBMISSION_GRADE: {
      DEFAULT: "/course/submission-grade",
      GET_BY_USER_ID_ASSIGNMENT_ID: "/course/submission-grade/user",
      GET_BY_ID: "/course/submission-grade/:id",
      CREATE: "/course/submission-grade",
      UPDATE_BY_ID: "/course/submission-grade/:id",
      DELETE_BY_ID: "/course/submission-grade/:id"
    },

    EXAM: {
      DEFAULT: "/course/:courseId/exam",
      OVERVIEW: "/course/exam/:id/overview",
      GET_BY_ID: "/course/exam/:id",
      CREATE: "/course/exam",
      EDIT: "/course/exam/:id",
      DELETE: "/course/exam/:id",
      START: "/course/exam/question/start-exam",
      END: "/course/exam/question/end-exam",
      SUBMIT: "/course/exam/question/submit",
      SUBMISSION: "/course/exam/question/submit/:id",
      SUBMISSION_STUDENT: "/course/exam/:id/submission"
    },
    EXAM_QUESTION: {
      DEFAULT: "/course/exam/:examId/question"
    },
    QUESTION: {
      DEFAULT: "/course/question",
      GET_BY_ID: "/course/question/:id",
      UPDATE_BY_ID: "/course/question/:id",
      DELETE_BY_ID: "/course/question/:id"
    },
    QUESTION_BANK_CATEGORY: {
      DEFAULT: "/course/question/bank/category",
      GET_BY_ID: "/course/question/bank/category/:id",
      UPDATE_BY_ID: "/course/question/bank/category/:id",
      DELETE_BY_ID: "/course/question/bank/category/:id",
      CREATE: "/course/question/bank/category/create"
    }
  },
  CODE_ASSESSMENT: {
    TAG: {
      DEFAULT: "/code-assessment/tag"
    },
    CODE_QUESTION: {
      DEFAULT: "/code-assessment/code-question",
      GET_BY_ID: "/code-assessment/code-question/:id",
      RECOMMENED: "/code-assessment/code-question/most-practicing-recently",
      ADMIN_CODE_QUESTION: "/code-assessment/code-question/admin-code-question"
    },
    CODE_SUBMISSION: {
      DEFAULT: "/code-assessment/code-submission",
      GET_BY_ID: "/code-assessment/code-submission/:id",
      ADMIN_CODE_SUBMISSION: "/code-assessment/code-submission/admin-code-submission"
    },
    SHARED_SOLUTION: {
      DEFAULT: "/code-assessment/shared-solution",
      GET_BY_ID: "code-assessment/shared-solution/:id",
      COMMENT: {
        DEFAULT: "code-assessment/shared-solution/:id/comment",
        EDIT_OR_DELETE: "code-assessment/shared-solution/comment/:id"
      },
      TAG: {
        DEFAULT: "code-assessment/shared-solution/:id/tag"
      }
    }
  },
  JUDGE0: {
    SUBMISSION: "/submissions"
  },
  AUTH: {
    USER: {
      GET_ALL_USERS: "/auth/users",
      GET_ALL_USERS_BY_ORGANIZATION: "/auth/users/organizations/:id",
      GET_STATISTICS: "/auth/users/statistics",
      SOCIAL_LOGIN: "/auth/users/social-login",
      LOGIN: "/auth/users/login",
      REFRESH_TOKEN: "/auth/users/refresh-token",
      LOGOUT: "/auth/users/logout",
      REGISTER: "/auth/users/register",
      CREATE_USER_BY_ADMIN: "/auth/users",
      GET_USER_BY_EMAIL: "/auth/users/get-by-email",
      GET_USER_BY_ID: "/auth/users/:id",
      DELETE_USER_BY_ID: "/auth/users/:id",
      FORGOT_PASSWORD: "/auth/users/forgot-password",
      VERIFY_OTP: "/auth/users/forgot-password/verify-otp",
      UPDATE_PROFILE_USER: "/auth/users/update-profile",
      UPDATE_USER_BY_ADMIN: "/auth/users/:id",
      ASSIGN_USER_TO_ORGANIZATION: "/auth/users/assign-user-to-org/:id",
      UNASSIGNED_USER_TO_ORGANIZATION: "/auth/users/unassigned-user-to-org/:id",
      CHANGE_PASSWORD: "/auth/users/change-password",
      RESET_PASSWORD: "/auth/users/forgot-password/change-password"
    },
    ORGANIZATION: {
      GET_ALL_ORGANIZATIONS: "/auth/organizations",
      CREATE_ORGANIZATION: "/auth/organizations",
      CREATE_ORGANIZATION_BY_CONTACT_US: "/auth/organizations/contact-us",
      GET_ORGANIZATION_BY_ID: "/auth/organizations/:id",
      UPDATE_ORGANIZATION_BY_ID: "/auth/organizations/:id",
      DELETE_ORGANIZATION_BY_ID: "/auth/organizations/:id"
    }
  }
};
