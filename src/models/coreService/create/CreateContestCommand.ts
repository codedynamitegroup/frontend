export interface CreateContestCommand {
  name: string;
  description: string;
  thumbnailUrl: string;
  startTime: string;
  endTime?: string | null;
}
