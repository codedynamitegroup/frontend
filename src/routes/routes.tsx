import LecturerCourseDetail from "pages/client/lecturer/CourseDetail";
import LecturerCourseGrade from "pages/client/lecturer/CourseGrade";
import LecturerCourseManagement from "pages/client/lecturer/CourseManagement";
import LecturerCourseParticipant from "pages/client/lecturer/CourseParticipant";

export const routes = {
  lecturer: {
    code_management: "/lecturer/code-management",
    assignment_management: "/lecturer/assignment-management",
    course_management: {
      path: "/lecturer/course-management",
      Component: LecturerCourseManagement
    },
    course: {
      detail: { path: "/lecturer/course/:courseId/detail", Component: LecturerCourseDetail },
      assignment: { path: "/lecturer/course/:courseId/assignment" },
      grade: { path: "/lecturer/course/:courseId/grade", Component: LecturerCourseGrade },
      participant: {
        path: "/lecturer/course/:courseId/participant",
        Component: LecturerCourseParticipant
      }
    }
  }
};
