import { UserCourseEntity } from "./UserCourseEntity";

export interface CourseEntity {
  id: string;
  courseIdMoodle: string;
  teachers: UserCourseEntity[];
  name: string;
  courseType: string;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
