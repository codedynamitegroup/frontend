import { TestCaseEntity } from "models/codeAssessmentService/entity/TestCaseEntity";
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
};
export { type CodeQuestionFormData };
