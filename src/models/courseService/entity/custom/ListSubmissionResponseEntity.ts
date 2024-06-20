import { SubmissionAssignmentUserResponseEntity } from "./SubmissionAssignmentUserResponseEntity";
import { UserSubmissionAssignmentResponseEntity } from "./UserSubmissionAssignmentResponseEntity";

export interface ListSubmissionResponseEntity {
  id: string;
  fullName: string;
  email: string;
  users: UserSubmissionAssignmentResponseEntity[];
}
