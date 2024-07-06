import { ProgrammingLanguageAdminEntity } from "models/codeAssessmentService/entity/ProgrammingLanguageAdminEntity";
import { QuestionDifficultyEnum } from "models/coreService/enum/QuestionDifficultyEnum";

type CodeQuestionFormData = {
  name: string;
  problemStatement: string;
  inputFormat: string;
  outputFormat: string;
  contraints: string;
  isPublic: boolean;
  allowImport: boolean;
  difficulty: QuestionDifficultyEnum;
  testCases: { id: string; inputData: string; outputData: string; sample: boolean }[];
  tags: string[];
  programmingLanguages: ProgrammingLanguageAdminEntity[];
};
export { type CodeQuestionFormData };
