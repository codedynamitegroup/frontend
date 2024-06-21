import { AssignmentResourceEntity } from "../AssignmentResourceEntity";
import { SubmissionAssignmentOnlineTextEntity } from "../SubmissionAssignmentOnlineTextEntity";
import { SubmissionGradeEntity } from "../SubmissionGradeEntity";
export interface SubmissionAssignmentUserResponseEntity {
  id: string;
  isGraded: boolean;
  submissionAssignmentFiles: AssignmentResourceEntity[];
  submissionAssignmentOnlineText: SubmissionAssignmentOnlineTextEntity;
  submissionGrade: SubmissionGradeEntity;
  content: string;
  feedback: string;
  submitTime: Date;
  timemodefied: Date;
}
