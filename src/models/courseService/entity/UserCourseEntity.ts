export interface UserCourseEntity {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface CourseUserResponse {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
