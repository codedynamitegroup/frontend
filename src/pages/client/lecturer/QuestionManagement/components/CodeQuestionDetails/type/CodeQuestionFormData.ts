import { ProgrammingLanguageAdminEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageAdminEntity";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";

type CodeQuestionFormData = {
  name: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  maxGrade: number;
  isPublic: boolean;
  allowImport: boolean;
  difficulty: QuestionDifficultyEnum;
  testCases: { id: string; inputData: string; outputData: string; isSample: boolean }[];
  tags: string[];
  programmingLanguages: ProgrammingLanguageAdminEntity[];
};
export { type CodeQuestionFormData };
