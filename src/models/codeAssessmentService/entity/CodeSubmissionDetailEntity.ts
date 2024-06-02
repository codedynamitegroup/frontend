import { UUID } from "crypto";
import { GradingStatus } from "../enum/GradingStatus";
import { FirstFailTestCaseEntity } from "./FirstFailTestCaseEntity";

export interface CodeSubmissionDetailEntity {
  id: UUID;
  codeQuestionId: UUID;
  programmingLanguageId: UUID;
  avgRuntime: number | undefined;
  avgMemory: number | undefined;
  createdAt: string | undefined;
  gradingStatus: GradingStatus;
  maxGrade: number;
  achievedGrade: number;
  description: string | undefined;

  headCode: string | undefined;
  bodyCode: string | undefined;
  tailCode: string | undefined;

  firstFailTestCase: FirstFailTestCaseEntity | undefined;
}
