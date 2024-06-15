export interface UpdateContestCommand {
  name?: string;
  description?: string;
  thumbnailUrl?: string;
  prizes?: string;
  rules?: string;
  scoring?: string;
  isPublic?: boolean;
  startTime?: string;
  endTime?: string | null;
  isRestrictedForum?: boolean;
  isDisabledForum?: boolean;
  questionIds?: string[];
}
