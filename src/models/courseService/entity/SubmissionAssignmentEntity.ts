import { AssignmentResourceEntity } from "./AssignmentResourceEntity";
import { SubmissionAssignmentFileEntity } from "./SubmissionAssignmentFileEntity";
import { SubmissionAssignmentOnlineTextEntity } from "./SubmissionAssignmentOnlineTextEntity";
import { SubmissionGradeEntity } from "./SubmissionGradeEntity";
import { UserResponseEntity } from "./UserResponseEntity";
export interface SubmissionAssignmentEntity {
  id: string;
  assignmentName: string;
  user: UserResponseEntity;
  isGraded: boolean;
  submissionAssignmentFiles: AssignmentResourceEntity[];
  submissionAssignmentOnlineText: SubmissionAssignmentOnlineTextEntity;
  submissionGrade: SubmissionGradeEntity;
  grade: number;
  content: string;
  feedback: string;
  submitTime: Date;
  timemodefied: Date;
}
