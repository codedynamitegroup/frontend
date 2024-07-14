import { AssignmentEntity } from "./AssignmentEntity";
import { ExamEntity } from "./ExamEntity";

export interface ModuleEntity {
  moduleId: string;
  assignment: AssignmentEntity;
  exam: ExamEntity;
  typeModule: string;
}
