export const API = {
  CORE: {
    CERTIFICATE_COURSE: {
      DEFAULT: "/core/certificate-courses",
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
      GET_BY_ID: "/core/contests/:id",
      UPDATE_BY_ID: "/core/contests/:id",
      DELETE_BY_ID: "/core/contests/:id",
      REGISTER_BY_ID: "/core/contests/:id/register",
      MOST_POPULAR: "/core/contests/popular",
      LEADERBOARD: "/core/contests/:id/leaderboard"
    },
    QUESTION: {
      DEFAULT: "/core/questions",
      GET_BY_ID: "/core/questions/:id",
      UPDATE_BY_ID: "/core/questions/:id",
      DELETE_BY_ID: "/core/questions/:id",
      SHORT_ANSWER_QUESTION: {
        CREATE: "/core/questions/shortanswer-question/create",
        GET_BY_ID: "/core/questions/shortanswer-question/:id",
        GET_ALL: "/core/questions/shortanswer-question"
      },
      ESSAY_QUESTION: {
        CREATE: "/core/questions/questions/essay-question/create",
        GET_BY_ID: "/core/questions/essay-question/:id",
        GET_ALL: "/core/questions/essay-question"
      },
      MULTIPLE_CHOICE_QUESTION: {
        CREATE: "questions/multichoice-question/create",
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
      GET_BY_ID: "/course/exam/:id",
      CREATE: "/course/exam"
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
    }
  },
  AUTH: {
    SOCIAL_LOGIN: "/auth/users/social-login",
    LOGIN: "/auth/users/login",
    REFRESH_TOKEN: "/auth/users/refresh-token",
    LOGOUT: "/auth/users/logout",
    REGISTER: "/auth/users/register",
    GET_USER_BY_EMAIL: "/auth/users/get-by-email/:email"
  }
};
