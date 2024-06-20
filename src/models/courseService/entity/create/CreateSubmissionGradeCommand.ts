export interface CreateSubmissionGradeCommand {
  submissionAssignmentId: string;
  grade: number;
  timeModified: string;
  timeCreated: string;
}
