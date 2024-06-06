import { UUID } from "crypto";

export interface SharedSolutionEntity {
  sharedSolutionId: UUID;
  totalVote: number;
  totalView: number;
  totalComment: number;
  createdAt: string;
}
