import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import { TestCaseEntity } from "./TestCaseEntity";
import { ProgrammingLanguageEntity } from "./ProgrammingLanguageEntity";

export interface CodeQuestionAdminEntity {
  id: string;
  questionId: string;
  name: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  isPublic: boolean;
  allowImport: boolean;
  difficulty: QuestionDifficultyEnum;
  testCases: TestCaseEntity[];
  languages: ProgrammingLanguageEntity[];
}
