import { OrganizationEntity } from "./OrganizationEntity";

export interface CourseTypeEntity {
  courseTypeId: string;
  moodleId: number;
  name: string;
  organizationId: string;
}
