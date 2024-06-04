import { UUID } from "crypto";

export interface RoleEntity {
  roleId: UUID;
  name: ERoleName;
  description: string;
}

export enum ERoleName {
  ADMIN = "admin",
  USER = "user",
  TEACHER_MOODLE = "teacher_moodle",
  STUDENT_MOODLE = "student_moodle",
  ADMIN_MOODLE = "admin_moodle"
}
