import { UUID } from "crypto";

export interface CommentEntity {
  id: UUID;
  content: string;
  numOfReply: number;
  totalVote: number;
  createdAt: string;
  user: {
    id: UUID;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}
