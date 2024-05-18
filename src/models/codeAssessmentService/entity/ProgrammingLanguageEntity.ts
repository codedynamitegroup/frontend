import { UUID } from "crypto";

export interface ProgrammingLanguageEntity {
  id: UUID;
  name: string;
  judge0Id: number;
  isActived: boolean;
  timeLimit: number;
  memoryLimit: number;
}
