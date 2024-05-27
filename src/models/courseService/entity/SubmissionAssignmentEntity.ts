import { SubmissionAssignmentFileEntity } from "./SubmissionAssignmentFileEntity";
import { SubmissionAssignmentOnlineTextEntity } from "./SubmissionAssignmentOnlineTextEntity";
export interface SubmissionAssignmentEntity {
  id: string;
  userId: string;
  isGraded: boolean;
  submissionAssignmentFile: SubmissionAssignmentFileEntity;
  submissionAssignmentOnlineText: SubmissionAssignmentOnlineTextEntity;
  grade: number;
  content: string;
  submitTime: Date;
  timemodefied: Date;
}
