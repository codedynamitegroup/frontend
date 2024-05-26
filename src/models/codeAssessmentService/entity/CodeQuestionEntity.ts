import { UUID } from "crypto";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import { TestCaseEntity } from "./TestCaseEntity";
import { ProgrammingLanguageEntity } from "models/coreService/entity/ProgrammingLanguageEntity";
import { CodeSubmissionEntity } from "./CodeSubmissionEntity";

export interface CodeQuestionEntity {
  id: UUID;
  name: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  done: boolean;
  difficulty: QuestionDifficultyEnum;
  codeSubmissions: CodeSubmissionEntity[];
  sampleTestCases: TestCaseEntity[];
  languages: ProgrammingLanguageEntity[];
}
