import { UUID } from "crypto";

export interface RoleEntity {
  roleId: UUID;
  name: ERoleName;
  description: string;
}

export enum ERoleName {
  ADMIN = "admin",
  USER = "user",
  LECTURER_MOODLE = "lecturer_moodle",
  STUDENT_MOODLE = "student_moodle",
  ADMIN_MOODLE = "admin_moodle"
}
