import { UUID } from "crypto";

export interface SharedSolutionEntity {
  sharedSolutionId: UUID;
  totalVote: number;
  totalView: number;
  totalComment: number;
  createdAt: string;
  title: string;
  user: {
    id: UUID;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  };
  tags: {
    id: UUID;
    name: string;
  }[];
}
