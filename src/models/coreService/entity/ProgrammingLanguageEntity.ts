import { UUID } from "crypto";

export interface ProgrammingLanguageEntity {
  id: UUID;
  name: string;
  judge0Id: number;
  timeLimit: number;
  memoryLimit: number;
  isActived: boolean;
  headCode: string;
  bodyCode: string;
  tailCode: string;
  sourceCode: string | null;
}
