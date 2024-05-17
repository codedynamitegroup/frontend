import { UUID } from "crypto";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";
import { TestCaseEntity } from "./TestCaseEntity";
import { ProgrammingLanguageEntity } from "models/coreService/entity/ProgrammingLanguageEntity";

export interface CodeQuestionEntity {
  id: UUID;
  name: string;
  problemStatement: string;
  done: boolean;
  difficulty: QuestionDifficultyEnum;
  sourceCode: string;
  sourceCodeLanguageId: UUID;
  sampleTestCases: TestCaseEntity[];
  languages: ProgrammingLanguageEntity[];
}
