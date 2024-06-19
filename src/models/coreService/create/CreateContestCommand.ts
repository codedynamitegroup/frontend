export interface CreateContestCommand {
  orgId?: string | null;
  name: string;
  description: string;
  thumbnailUrl: string;
  startTime: string;
  endTime?: string | null;
}
