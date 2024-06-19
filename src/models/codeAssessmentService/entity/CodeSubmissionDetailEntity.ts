import { UUID } from "crypto";
import { GradingStatus } from "../enum/GradingStatus";
import { FirstFailTestCaseEntity } from "./FirstFailTestCaseEntity";

export interface CodeSubmissionDetailEntity {
  id: UUID;
  codeQuestionId: UUID;
  programmingLanguageId: UUID;
  programmingLanguageName: string;
  avgRuntime: number | undefined;
  avgMemory: number | undefined;
  createdAt: string | undefined;
  gradingStatus: GradingStatus;
  maxGrade: number;
  achievedGrade: number;
  description: string | undefined;

  user?: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    email: string;
  };

  codeQuestion?: {
    id: string;
    name: string;
  };

  headCode: string | undefined;
  bodyCode: string | undefined;
  tailCode: string | undefined;
  sourceCode: string | undefined;

  firstFailTestCase: FirstFailTestCaseEntity | undefined;
}
