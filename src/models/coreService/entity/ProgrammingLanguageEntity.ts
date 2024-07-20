import { UUID } from "crypto";

export interface ProgrammingLanguageEntity {
  programmingLanguageId: string;
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

export interface ProgrammingLanguageEntityWithTopic {
  programmingLanguageId: UUID;
  name: string;
  compilerApiId: number;
  timeLimit: number;
  memoryLimit: number;
}

export interface GetProgrammingLanguageEntity {
  id: UUID;
  name: string;
  compilerApiId: number;
  timeLimit: number;
  memoryLimit: number;
}
