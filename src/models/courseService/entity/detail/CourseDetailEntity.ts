import { SectionEntity } from "../SectionEntity";
import { CourseUserResponse } from "../UserCourseEntity";

export interface CourseDetailEntity {
  id: string;
  name: string;
  courseIdMoodle: number;
  sections: SectionEntity[];
  assignments: AssignmentResponseEntity[];
  participants: CourseUserResponse[];
}

interface AssignmentResponseEntity {
  id: string;
  title: string;
  intro: string;
  timeClose: string;
}
