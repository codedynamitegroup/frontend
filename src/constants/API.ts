export const API = {
  CORE: {
    CERTIFICATE_COURSE: {
      DEFAULT: "/core/certificate-courses",
      GET_BY_ID: "/core/certificate-courses/:id",
      UPDATE_BY_ID: "/core/certificate-courses/:id",
      DELETE_BY_ID: "/core/certificate-courses/:id",
      REGISTER_BY_ID: "/core/certificate-courses/register"
    },
    TOPIC: {
      DEFAULT: "/core/topics",
      GET_BY_ID: "/core/topics/:id",
      UPDATE_BY_ID: "/core/topics/:id",
      DELETE_BY_ID: "/core/topics/:id"
    },
    CHAPTER: {
      DEFAULT: "/core/chapters",
      GET_BY_ID: "/core/chapters/:id",
      UPDATE_BY_ID: "/core/chapters/:id",
      DELETE_BY_ID: "/core/chapters/:id"
    },
    CONTEST: {
      DEFAULT: "/core/contests",
      GET_BY_ID: "/core/contests/:id",
      UPDATE_BY_ID: "/core/contests/:id",
      DELETE_BY_ID: "/core/contests/:id",
      REGISTER_BY_ID: "/core/contests/:id/register"
    }
  },
  CODE_ASSESSMENT: {
    TAG: {
      GET: "/code-assessment/tag"
    }
  }
};
