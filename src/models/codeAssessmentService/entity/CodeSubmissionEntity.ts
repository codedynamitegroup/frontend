import { UUID } from "crypto";

export interface CodeSubmissionEntity {
  id: string;
  languageId: UUID;
  headCode: string;
  bodyCode: string;
  tailCode: string;
}
