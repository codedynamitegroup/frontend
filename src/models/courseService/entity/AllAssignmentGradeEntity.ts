import { AssignmentGradeEntity } from "./AssignmentGradeEntity";

export interface AllAssignmentGradeEntity {
  assignments: AssignmentGradeEntity[];
  countSubmission: number;
  currentPage?: number;
  totalItems?: number;
  totalPages?: number;
}
