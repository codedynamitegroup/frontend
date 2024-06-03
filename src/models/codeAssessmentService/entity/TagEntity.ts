import { UUID } from "crypto";
import { TagType } from "../enum/TagType";

export interface TagEntity {
  id: UUID;
  name: string;
  numOfCodeQuestion: number;
  type: TagType;
  isChoosen: boolean | undefined;
}
