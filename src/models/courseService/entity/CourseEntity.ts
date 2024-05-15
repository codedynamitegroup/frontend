export interface CourseEntity {
  id: string;
  courseIdMoodle: string;
  name: string;
  courseType: string;
  visible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
