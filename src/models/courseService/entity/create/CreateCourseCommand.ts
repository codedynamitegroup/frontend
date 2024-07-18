export interface CreateCourseCommand {
  name: string;
  visible: boolean;
  courseTypeId: string;
  organizationId: string;
}
