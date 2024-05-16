export const API = {
  CORE: {
    CERTIFICATE_COURSE: {
      DEFAULT: "/core/certificate-courses",
      GET_BY_IS_REGISTERED: "/core/certificate-courses/fetch-by-is-registered",
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
    }
  }
};
