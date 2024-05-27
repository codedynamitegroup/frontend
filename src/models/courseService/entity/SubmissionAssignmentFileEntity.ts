import { AssignmentResourceEntity } from "./AssignmentResourceEntity";

export interface SubmissionAssignmentFileEntity {
  id: string;
  files: AssignmentResourceEntity[];
}
