import { UUID } from "crypto";

export interface TestCaseEntity {
  id: UUID;

  inputData: string;

  outputData: string;

  isSample: boolean;
}
