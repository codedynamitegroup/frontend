export const API = {
  CORE: {
    CERTIFICATE_COURSE: {
      DEFAULT: "/core/certificate-courses",
      MY_COURSES: "/core/certificate-courses/me",
      MOST_ENROLLED: "/core/certificate-courses/most-enrolled",
      GET_BY_ID: "/core/certificate-courses/:id",
      UPDATE_BY_ID: "/core/certificate-courses/:id",
      DELETE_BY_ID: "/core/certificate-courses/:id",
      REGISTER_BY_ID: "/core/certificate-courses/:id/register"
    },
    TOPIC: {
      DEFAULT: "/core/topics",
      GET_BY_ID: "/core/topics/:id",
      UPDATE_BY_ID: "/core/topics/:id",
      DELETE_BY_ID: "/core/topics/:id"
    },
    CHAPTER: {
      DEFAULT: "/core/chapters?certificateCourseId=:certificateCourseId",
      GET_BY_ID: "/core/chapters/:id",
      UPDATE_BY_ID: "/core/chapters/:id",
      DELETE_BY_ID: "/core/chapters/:id"
    },
    CONTEST: {
      DEFAULT: "/core/contests",
      CONTEST_MANAGEMENT_FOR_ADMIN: "/core/contests/admin",
      CREATE: "/core/contests/create",
      GET_BY_ID: "/core/contests/:id",
      UPDATE_BY_ID: "/core/contests/:id",
      DELETE_BY_ID: "/core/contests/:id",
      REGISTER_BY_ID: "/core/contests/:id/register",
      MOST_POPULAR: "/core/contests/popular",
      LEADERBOARD: "/core/contests/:id/leaderboard",
      GET_USERS_OF_CONTEST: "/core/contests/:id/users",
      JOIN_CONTEST: "/core/contests/:id/register"
    },
    QUESTION: {
      DEFAULT: "/core/questions",
      CLONE: "/core/questions/clone",
      GET_BY_CATEGORY_ID: "/core/questions/category/:categoryId",
      GET_BY_ID: "/core/questions/:id",
      UPDATE_BY_ID: "/core/questions/:id",
      DELETE_BY_ID: "/core/questions/:id",
      QUESTION_DETAIL: "/core/questions/detail",
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
      }
    }
  },
  COURSE: {
    COURSE: {
      DEFAULT: "/course/course",
      SECTION: "/course/section",
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
      CREATE: "/course/assignment",
      UPDATE_BY_ID: "/course/assignment/:id",
      DELETE_BY_ID: "/course/assignment/:id"
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
    EXAM: {
      DEFAULT: "/course/:courseId/exam",
      OVERVIEW: "/course/exam/:id/overview",
      GET_BY_ID: "/course/exam/:id",
      CREATE: "/course/exam",
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
      GET_BY_ID: "/code-assessment/code-question/:id"
    },
    CODE_SUBMISSION: {
      DEFAULT: "/code-assessment/code-submission",
      GET_BY_ID: "/code-assessment/code-submission/:id"
    }
  },
  JUDGE0: {
    SUBMISSION: "/submissions"
  },
  AUTH: {
    GET_ALL: "/auth/users",
    SOCIAL_LOGIN: "/auth/users/social-login",
    LOGIN: "/auth/users/login",
    REFRESH_TOKEN: "/auth/users/refresh-token",
    LOGOUT: "/auth/users/logout",
    REGISTER: "/auth/users/register",
    GET_USER_BY_EMAIL: "/auth/users/get-by-email",
    FORGOT_PASSWORD: "/auth/users/forgot-password",
    VERIFY_OTP: "/auth/users/forgot-password/verify-otp",
    UPDATE_PROFILE_USER: "/auth/users",
    CHANGE_PASSWORD: "/auth/users/change-password",
    RESET_PASSWORD: "/auth/users/forgot-password/change-password"
  }
};
