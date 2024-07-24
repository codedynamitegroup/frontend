import { AssignmentResourceEntity } from "./AssignmentResourceEntity";
import { SubmissionAssignmentFileEntity } from "./SubmissionAssignmentFileEntity";
import { SubmissionAssignmentOnlineTextEntity } from "./SubmissionAssignmentOnlineTextEntity";
import { SubmissionGradeEntity } from "./SubmissionGradeEntity";
import { UserResponseEntity } from "./UserResponseEntity";
export interface SubmissionAssignmentEntity {
  id: string;
  userId: string;
  assignmentName: string;
  fullName: string;
  email: string;
  isGraded: boolean;
  submissionAssignmentFiles: AssignmentResourceEntity[];
  submissionGrade: SubmissionGradeEntity;
  content: string;
  feedback: string;
  submitTime: Date;
  timemodefied: Date;
}
