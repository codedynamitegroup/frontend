import { UUID } from "crypto";

export interface ProgrammingLanguageEntity {
  programmingLanguageId: UUID;
  name: string;
  judge0Id: number;
  timeLimit: number;
  memoryLimit: number;
  isActived: boolean;
  headCode: string;
  bodyCode: string;
  tailCode: string;
}
