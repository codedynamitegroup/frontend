import { UserContestRankEntity } from "./UserContestRankEntity";

export interface ContestLeaderboardEntity {
  participantRank?: UserContestRankEntity;
  contestLeaderboard: UserContestRankEntity[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}
