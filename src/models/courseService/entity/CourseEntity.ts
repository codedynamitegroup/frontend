import { CourseTypeEntity } from "./CourseTypeEntity";
import { UserCourseEntity } from "./UserCourseEntity";

export interface CourseEntity {
  id: string;
  courseIdMoodle: string;
  teachers: UserCourseEntity[];
  name: string;
  courseType: CourseTypeEntity;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
