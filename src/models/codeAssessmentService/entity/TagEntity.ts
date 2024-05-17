import { UUID } from "crypto";

export interface TagEntity {
  id: UUID;
  name: String;
  numberOfQuestion: Number;
}
