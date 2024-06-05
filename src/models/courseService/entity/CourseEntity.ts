import { CourseTypeEntity } from "./CourseTypeEntity";
import { OrganizationEntity } from "./OrganizationEntity";
import { UserCourseEntity } from "./UserCourseEntity";

export interface CourseEntity {
  id: string;
  courseIdMoodle: number;
  teachers: UserCourseEntity[];
  organization: OrganizationEntity;
  name: string;
  courseType: CourseTypeEntity;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
