import { SubmissionAssignmentFileEntity } from "./SubmissionAssignmentFileEntity";
import { SubmissionAssignmentOnlineTextEntity } from "./SubmissionAssignmentOnlineTextEntity";
import { SubmissionGradeEntity } from "./SubmissionGradeEntity";
import { UserResponseEntity } from "./UserResponseEntity";
export interface SubmissionAssignmentEntity {
  id: string;
  user: UserResponseEntity;
  isGraded: boolean;
  submissionAssignmentFile: SubmissionAssignmentFileEntity;
  submissionAssignmentOnlineText: SubmissionAssignmentOnlineTextEntity;
  submissionGrade: SubmissionGradeEntity;
  grade: number;
  content: string;
  submitTime: Date;
  timemodefied: Date;
}
